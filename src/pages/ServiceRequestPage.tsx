import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X, UploadCloud } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "../components/PageHeader";
import { Badge, Button, Card, Field, Input, Textarea } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";
import type { ServiceRecord } from "../types";
import { generateTrackingNo } from "../utils/service";

const onsitePreference = "Mümkünse Yerinde Servis İstiyorum";
const pickupPreference = "Ürün adresten alınsın";
const dropOffPreference = "Kendim servise bırakacağım";
const addressRequiredPreferences = [onsitePreference, pickupPreference] as const;

const schema = z.object({
  productCategory: z.string().min(2, "Ürün kategorisi gerekli"),
  brand: z.string().min(2, "Marka gerekli"),
  model: z.string().min(1, "Model gerekli"),
  serialNo: z.string().min(1, "Seri numarası gerekli"),
  warranty: z.string().min(1, "Garanti durumu seçin"),
  issueTitle: z.string().min(3, "Sorun başlığı gerekli"),
  description: z.string().min(10, "Lütfen biraz daha detay verin"),
  urgency: z.enum(["Normal", "Acil", "Kritik"]),
  preference: z.enum([
    onsitePreference,
    pickupPreference,
    dropOffPreference,
  ]),
  neighborhood: z.string().optional(),
  avenue: z.string().optional(),
  street: z.string().optional(),
  buildingNo: z.string().optional(),
  doorNo: z.string().optional(),
  pickupDate: z.string().optional(),
  timeRange: z.string().optional(),
  consent: z.boolean().refine(Boolean, "KVKK/onay kutusu işaretlenmeli"),
}).superRefine((data, context) => {
  if (!addressRequiredPreferences.includes(data.preference as (typeof addressRequiredPreferences)[number])) {
    return;
  }

  const requiredFields: Array<[keyof FormAddressFields, string]> = [
    ["neighborhood", "Mahalle gerekli"],
    ["street", "Sokak gerekli"],
    ["buildingNo", "Bina no gerekli"],
    ["doorNo", "Kapı no gerekli"],
    ["pickupDate", "Tarih gerekli"],
    ["timeRange", "Saat aralığı gerekli"],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!data[field]?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: [field],
      });
    }
  });
});

type FormAddressFields = {
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
  doorNo?: string;
  pickupDate?: string;
  timeRange?: string;
};

type FormValues = z.infer<typeof schema>;

const steps = ["Ürün", "Sorun", "Servis", "Onay"];
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
  const [step, setStep] = useState(0);
  const [trackingNo, setTrackingNo] = useState("");
  const [legalModal, setLegalModal] = useState<keyof typeof legalContent | null>(null);
  const navigate = useNavigate();
  const createService = usePortalStore((state) => state.createService);
  const customer = usePortalStore((state) => state.customer);
  const services = usePortalStore((state) => state.services);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      urgency: "Normal",
      preference: dropOffPreference,
      warranty: "Garanti dışı",
      consent: false,
    },
  });

  const values = watch();
  const needsAddress = addressRequiredPreferences.includes(
    values.preference as (typeof addressRequiredPreferences)[number],
  );
  const isOnsiteService = values.preference === onsitePreference;
  const timingTitle = isOnsiteService ? "Servis zamanı" : "Alım zamanı";
  const dateLabel = isOnsiteService
    ? "Servis İstediğiniz Tarih"
    : "Alınmasını İstediğiniz Tarih";

  const next = async () => {
    const serviceStepFields: Array<keyof FormValues> = needsAddress
      ? [
          "preference",
          "neighborhood",
          "street",
          "buildingNo",
          "doorNo",
          "pickupDate",
          "timeRange",
        ]
      : ["preference"];
    const fields: Array<keyof FormValues>[] = [
      ["productCategory", "brand", "model", "serialNo", "warranty"],
      ["issueTitle", "description", "urgency"],
      serviceStepFields,
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = async (data: FormValues) => {
    const generated = generateTrackingNo(services.map((service) => service.trackingNo));
    const now = new Date().toLocaleString("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const requiresAddress = addressRequiredPreferences.includes(
      data.preference as (typeof addressRequiredPreferences)[number],
    );
    const address = requiresAddress
      ? [
          `${data.neighborhood} Mah.`,
          data.avenue ? `${data.avenue} Cad.` : "",
          `${data.street} Sok.`,
          `Bina No: ${data.buildingNo}`,
          `Kapı No: ${data.doorNo}`,
        ]
          .filter(Boolean)
          .join(" ")
      : "Müşteri ürünü servise bırakacak";
    const appointment = requiresAddress
      ? `${data.pickupDate}, ${data.timeRange}`
      : "Randevu gerekmez";
    const service: ServiceRecord = {
      id: `svc-${Date.now()}`,
      trackingNo: generated,
      customerId: customer.id,
      productCategory: data.productCategory,
      brand: data.brand,
      model: data.model,
      serialNo: data.serialNo,
      warranty: data.warranty,
      issueTitle: data.issueTitle,
      description: data.description,
      urgency: data.urgency,
      preference: data.preference,
      address,
      appointment,
      currentStatus: "Talep Alındı",
      lastUpdate: now,
      estimatedDelivery: "Servis incelemesi sonrası belirlenecek",
      technician: "Atama bekliyor",
      visibleNotes: ["Servis talebiniz FBS ekibine iletildi."],
      internalNotes: [],
      photos: [],
      timeline: [
        {
          status: "Talep Alındı",
          date: now,
          note: "Talep müşteri portalından backend API’ye gönderildi.",
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
        title="Yeni servis kaydı oluşturun"
        description="Birkaç kısa adımda ürün, sorun ve servis tercihinizi FBS ekibine iletin."
      />
      <form className="space-y-4 px-5 pb-6" onSubmit={handleSubmit(submit)}>
        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <div key={label} className="space-y-2">
              <div className={`h-2 rounded-full ${index <= step ? "bg-brand-600" : "bg-slate-200"}`} />
              <p className={`text-center text-xs font-bold ${index === step ? "text-brand-700" : "text-slate-400"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
        >
          <Card className="space-y-4 p-4">
            {step === 0 ? (
              <>
                <Field label="Ürün kategorisi" error={errors.productCategory?.message}>
                  <Input placeholder="Notebook, masaüstü, kamera..." {...register("productCategory")} />
                </Field>
                <Field label="Marka" error={errors.brand?.message}>
                  <Input placeholder="Lenovo, HP, Hikvision..." {...register("brand")} />
                </Field>
                <Field label="Model" error={errors.model?.message}>
                  <Input placeholder="Model adı" {...register("model")} />
                </Field>
                <Field label="Seri numarası" error={errors.serialNo?.message}>
                  <Input placeholder="Seri numarası" {...register("serialNo")} />
                </Field>
                <Field label="Garanti durumu" error={errors.warranty?.message}>
                  <select className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" {...register("warranty")}>
                    <option>Garanti kapsamında</option>
                    <option>Garanti dışı</option>
                    <option>Emin değilim</option>
                  </select>
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field label="Sorun başlığı" error={errors.issueTitle?.message}>
                  <Input placeholder="Kısa sorun başlığı" {...register("issueTitle")} />
                </Field>
                <Field label="Detaylı açıklama" error={errors.description?.message}>
                  <Textarea placeholder="Sorunu ne zaman ve nasıl yaşadığınızı yazın" {...register("description")} />
                </Field>
                <Field label="Aciliyet seviyesi" error={errors.urgency?.message}>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Normal", "Acil", "Kritik"] as const).map((urgency) => (
                      <label key={urgency} className="cursor-pointer">
                        <input className="peer sr-only" type="radio" value={urgency} {...register("urgency")} />
                        <span className="grid min-h-12 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:text-brand-700">
                          {urgency}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                  <UploadCloud className="mx-auto text-brand-600" size={28} />
                  <p className="mt-2 text-sm font-bold text-slate-700">Fotoğraf/video yükle</p>
                  <p className="mt-1 text-xs text-slate-500">Mock alan, dosya seçimi simüle edilir.</p>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
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
                {needsAddress ? (
                  <>
                    <div className="space-y-3">
                      <h2 className="text-base font-black text-slate-950">Adres</h2>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Mahalle" error={errors.neighborhood?.message}>
                          <Input placeholder="Örn. Nail Bey" {...register("neighborhood")} />
                        </Field>
                        <Field label="Cadde">
                          <Input placeholder="Cadde adı" {...register("avenue")} />
                        </Field>
                        <Field label="Sokak" error={errors.street?.message}>
                          <Input placeholder="Örn. Tuncay" {...register("street")} />
                        </Field>
                        <Field label="Bina No" error={errors.buildingNo?.message}>
                          <Input placeholder="09" {...register("buildingNo")} />
                        </Field>
                        <Field label="Kapı No" error={errors.doorNo?.message}>
                          <Input placeholder="Daire / kapı no" {...register("doorNo")} />
                        </Field>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-base font-black text-slate-950">{timingTitle}</h2>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label={dateLabel} error={errors.pickupDate?.message}>
                          <Input type="date" {...register("pickupDate")} />
                        </Field>
                        <Field label="Saat Aralığı" error={errors.timeRange?.message}>
                          <select
                            className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                            {...register("timeRange")}
                          >
                            <option value="">Saat aralığı seçin</option>
                            <option value="09:00 - 11:00">09:00 - 11:00</option>
                            <option value="11:00 - 13:00">11:00 - 13:00</option>
                            <option value="13:00 - 15:00">13:00 - 15:00</option>
                            <option value="15:00 - 17:00">15:00 - 17:00</option>
                            <option value="17:00 - 18:30">17:00 - 18:30</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg bg-brand-50 p-4 text-sm leading-6 text-brand-800">
                    Ürünü servise kendiniz bırakacağınız için adres ve alım zamanı bilgisi
                    istenmez.
                  </div>
                )}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h2 className="text-lg font-black text-slate-950">Talep özeti</h2>
                <div className="space-y-3 text-sm">
                  <Summary label="Ürün" value={`${values.brand || "-"} ${values.model || ""}`} />
                  <Summary label="Kategori" value={values.productCategory || "-"} />
                  <Summary label="Sorun" value={values.issueTitle || "-"} />
                  <Summary label="Aciliyet" value={<Badge tone={values.urgency === "Kritik" ? "rose" : values.urgency === "Acil" ? "amber" : "blue"}>{values.urgency}</Badge>} />
                  <Summary label="Servis tercihi" value={values.preference} />
                  {needsAddress ? (
                    <>
                      <Summary
                        label="Adres"
                        value={[
                          values.neighborhood ? `${values.neighborhood} Mah.` : "",
                          values.avenue ? `${values.avenue} Cad.` : "",
                          values.street ? `${values.street} Sok.` : "",
                          values.buildingNo ? `Bina No: ${values.buildingNo}` : "",
                          values.doorNo ? `Kapı No: ${values.doorNo}` : "",
                        ]
                          .filter(Boolean)
                          .join(" ") || "-"}
                      />
                      <Summary
                        label={timingTitle}
                        value={values.pickupDate && values.timeRange ? `${values.pickupDate}, ${values.timeRange}` : "-"}
                      />
                    </>
                  ) : (
                    <Summary label="Teslim şekli" value="Müşteri ürünü servise bırakacak" />
                  )}
                </div>
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
              </>
            ) : null}
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>
            <ChevronLeft size={18} />
            Geri
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={next}>
              İleri
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button type="submit">Talebi gönder</Button>
          )}
        </div>
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

function Summary({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  );
}
