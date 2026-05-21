import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "../components/PageHeader";
import { Button, Card, Field, Input, Textarea } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";
import type { Customer, ServiceRecord } from "../types";
import { formatTurkishMobileInput, isValidTurkishMobile, normalizePhone, phonePrefix } from "../utils/phone";
import { generateTrackingNo } from "../utils/service";

const onsitePreference = "Mümkünse Yerinde Servis İstiyorum";
const pickupPreference = "Ürün adresten alınsın";
const dropOffPreference = "Kendim servise bırakacağım";

const schema = z.object({
  name: z.string().min(3, "Ad soyad gerekli"),
  phone: z.string().refine(isValidTurkishMobile, "Geçerli bir cep telefonu yazın"),
  email: z
    .string()
    .optional()
    .refine((value) => !value || value.includes("@"), "Geçerli bir e-posta yazın"),
  product: z.string().min(2, "Ürün bilgisi gerekli"),
  description: z.string().optional(),
  preference: z.enum([
    onsitePreference,
    pickupPreference,
    dropOffPreference,
  ]),
  consent: z.boolean().refine(Boolean, "KVKK/onay kutusu işaretlenmeli"),
});

type FormValues = z.infer<typeof schema>;

const legalContent = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    body: [
      "FBS Fırat Bilgisayar Sistemleri, servis talebinin alınması, müşteri ile iletişim kurulması, teknik servis sürecinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla ad soyad, telefon, e-posta, adres ve servis cihaz bilgilerini işler.",
      "Kişisel verileriniz yalnızca hizmetin sunulması için gerekli süre boyunca saklanır; kanuni zorunluluklar dışında üçüncü kişilerle paylaşılmaz.",
      "KVKK kapsamında verilerinize erişme, düzeltme, silme, işlenmesini kısıtlama ve itiraz haklarınız için info@firatbilgisayar.com.tr adresinden bizimle iletişime geçebilirsiniz.",
    ],
  },
  terms: {
    title: "Servis İşlem Koşulları",
    body: [
      "Servis talebi oluşturulduktan sonra cihaz veya yerinde servis ihtiyacı ön incelemeye alınır. Arıza tespiti sonrası ücretli işlem gerekiyorsa müşteriden onay alınmadan onarım başlatılmaz.",
      "Yerinde servis, ürün adresten alma ve servise bırakma tercihleri randevu uygunluğuna göre planlanır. Belirtilen tarih ve saat aralığı ön talep niteliğindedir.",
      "Servis süreci boyunca müşteriye görünür notlar, fiyat teklifleri ve durum güncellemeleri müşteri panelinden takip edilebilir.",
    ],
  },
};

export function ServiceRequestPage() {
  const [trackingNo, setTrackingNo] = useState("");
  const [legalModal, setLegalModal] = useState<keyof typeof legalContent | null>(null);
  const navigate = useNavigate();
  const createService = usePortalStore((state) => state.createService);
  const createCustomer = usePortalStore((state) => state.createCustomer);
  const customer = usePortalStore((state) => state.customer);
  const isAuthenticated = usePortalStore((state) => state.isAuthenticated);
  const services = usePortalStore((state) => state.services);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: isAuthenticated ? customer.name : "",
      phone: isAuthenticated ? formatTurkishMobileInput(customer.phone) : phonePrefix,
      email: isAuthenticated ? customer.email : "",
      preference: dropOffPreference,
      consent: false,
    },
  });
  const phoneRegistration = register("phone");

  const submit = async (data: FormValues) => {
    const generated = generateTrackingNo(services.map((service) => service.trackingNo));
    const now = new Date().toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const description = data.description?.trim()
      || "Müşteri açıklama eklemedi. Teknik servis ekibi telefonla detay alacak.";
    const email = data.email?.trim();
    const contactEmail = email || "Belirtilmedi";
    const contactPhone = data.phone.trim();
    const normalizedPhone = normalizePhone(contactPhone);
    const requestCustomer: Customer = {
      id: `cus-${normalizedPhone}`,
      name: data.name.trim(),
      phone: contactPhone,
      email: email || (isAuthenticated ? customer.email : ""),
      addresses: [],
    };
    const createdCustomer = await createCustomer(requestCustomer);
    const service: ServiceRecord = {
      id: `svc-${Date.now()}`,
      trackingNo: generated,
      customerId: createdCustomer.id,
      contactName: createdCustomer.name,
      contactPhone: createdCustomer.phone,
      contactEmail: createdCustomer.email || contactEmail,
      productCategory: data.product,
      brand: "Telefonla tamamlanacak",
      model: data.product,
      serialNo: "Telefonla tamamlanacak",
      warranty: "Telefonla netleştirilecek",
      issueTitle: `${data.product} servis talebi`,
      description,
      urgency: "Normal",
      preference: data.preference,
      address: "Servis ekibi telefonla alacak",
      appointment: "Servis ekibi telefonla planlayacak",
      currentStatus: "Talep Alındı",
      lastUpdate: now,
      estimatedDelivery: "Servis incelemesi sonrası belirlenecek",
      technician: "Atama bekliyor",
      visibleNotes: [
        "Servis talebiniz alındı. FBS teknik servis ekibi detayları almak için telefonla arayacak.",
      ],
      internalNotes: [
        `Hızlı kayıt iletişim: ${data.name.trim()} / ${contactPhone} / ${contactEmail}`,
      ],
      photos: [],
      timeline: [
        {
          status: "Talep Alındı",
          date: now,
          note: "Hızlı servis talebi müşteri portalından alındı.",
          completed: false,
        },
      ],
      messages: [],
    };
    const createdService = await createService(service);
    setTrackingNo(createdService.trackingNo);
  };

  if (trackingNo) {
    return (
      <div className="px-5 pb-6 pt-6">
        <Card className="p-5 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-950">Talebiniz alındı</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Servis takip numaranız hazır.</p>
          <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-lg font-black text-brand-700">
            {trackingNo}
          </p>
          <Button className="mt-5 w-full" onClick={() => navigate("/servis-takip")}>
            Servis durumunu takip et
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Servis talebi"
        title="Hızlı servis kaydı açın"
        description="İletişim bilginizi, ürününüzü ve servis tercihinizi bırakın; FBS teknik servis ekibi detayları almak için sizi telefonla arasın."
      />
      <form className="space-y-4 px-5 pb-6" onSubmit={handleSubmit(submit)}>
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
          Formu kısa tuttuk. Cihaz modeli, seri numarası, garanti, adres ve zaman planı gibi
          detayları servis ekibimiz telefonla görüşerek tamamlayacak.
        </div>

        <Card className="space-y-5 p-4">
          <div className="space-y-3">
            <h2 className="text-lg font-black text-slate-950">İletişim bilgileri</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Ad soyad" error={errors.name?.message}>
                <Input placeholder="Adınız soyadınız" {...register("name")} />
              </Field>
              <Field label="Telefon" error={errors.phone?.message}>
                <Input
                  inputMode="tel"
                  placeholder="+90 ___ ___ __ __"
                  {...phoneRegistration}
                  onChange={(event) => {
                    const formattedPhone = formatTurkishMobileInput(event.target.value);
                    setValue("phone", formattedPhone, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  onFocus={(event) => {
                    if (!event.target.value.trim()) {
                      setValue("phone", phonePrefix);
                    }
                  }}
                />
              </Field>
            </div>
            <Field label="E-posta (isteğe bağlı)" error={errors.email?.message}>
              <Input inputMode="email" placeholder="ornek@mail.com" type="email" {...register("email")} />
            </Field>
          </div>

          <Field label="Ürün" error={errors.product?.message}>
            <Input placeholder="Notebook, masaüstü PC, yazıcı, monitör..." {...register("product")} />
          </Field>

          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <UploadCloud className="mx-auto text-brand-600" size={28} />
            <p className="mt-2 text-sm font-bold text-slate-700">İsteğe bağlı fotoğraf</p>
            <p className="mt-1 text-xs text-slate-500">Mock alan, dosya seçimi sonraki backend aşamasında bağlanacak.</p>
          </div>

          <Field label="İsteğe bağlı açıklama" error={errors.description?.message}>
            <Textarea placeholder="İsterseniz yaşadığınız sorunu kısaca yazın. Boş bırakabilirsiniz." {...register("description")} />
          </Field>

          <Field label="Servis tercihi" error={errors.preference?.message}>
            <div className="space-y-2">
              {([
                onsitePreference,
                pickupPreference,
                dropOffPreference,
              ] as const).map((preference) => (
                <label key={preference} className="block cursor-pointer">
                  <input className="peer sr-only" type="radio" value={preference} {...register("preference")} />
                  <span className="flex min-h-12 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:text-brand-700">
                    {preference}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            <input className="mt-1 h-5 w-5 rounded border-slate-300 text-brand-600" type="checkbox" {...register("consent")} />
            <span>
              <button
                className="font-bold text-brand-700 underline underline-offset-4"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalModal("kvkk");
                }}
                type="button"
              >
                KVKK
              </button>{" "}
              ve{" "}
              <button
                className="font-bold text-brand-700 underline underline-offset-4"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalModal("terms");
                }}
                type="button"
              >
                servis işlem koşullarını
              </button>{" "}
              onaylıyorum.
            </span>
          </label>
          {errors.consent ? <p className="text-xs font-medium text-rose-600">{errors.consent.message}</p> : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Talep gönderiliyor" : "Servis kaydı aç"}
          </Button>
        </Card>
      </form>
      {legalModal ? (
        <LegalModal
          body={legalContent[legalModal].body}
          onClose={() => setLegalModal(null)}
          title={legalContent[legalModal].title}
        />
      ) : null}
    </div>
  );
}

function LegalModal({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-5 backdrop-blur-sm">
      <div className="max-h-[82vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
          {body.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="border-t border-slate-100 p-4">
          <Button className="w-full" onClick={onClose} type="button">
            Anladım
          </Button>
        </div>
      </div>
    </div>
  );
}
