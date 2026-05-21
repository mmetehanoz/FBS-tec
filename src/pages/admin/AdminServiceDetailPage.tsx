import { Plus, Send, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { serviceStatuses } from "../../data/mockData";
import { usePortalStore } from "../../hooks/usePortalStore";
import { Badge, Button, Card, Field, Input, Textarea } from "../../components/ui";
import { formatCurrency, sumOfferItemsByStatus } from "../../utils/service";
import { buildTimelineForStatus } from "../../utils/timeline";
import type {
  Message,
  PriceOfferItem,
  PriceOfferStatus,
  ServicePreference,
  ServiceRecord,
  ServiceStatus,
  Urgency,
} from "../../types";

type CallCenterForm = Pick<
  ServiceRecord,
  | "contactName"
  | "contactPhone"
  | "contactEmail"
  | "productCategory"
  | "brand"
  | "model"
  | "serialNo"
  | "warranty"
  | "issueTitle"
  | "description"
  | "urgency"
  | "preference"
  | "address"
  | "appointment"
  | "technician"
  | "estimatedDelivery"
>;

const emptyCallCenterForm: CallCenterForm = {
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  productCategory: "",
  brand: "",
  model: "",
  serialNo: "",
  warranty: "",
  issueTitle: "",
  description: "",
  urgency: "Normal",
  preference: "Kendim servise bırakacağım",
  address: "",
  appointment: "",
  technician: "",
  estimatedDelivery: "",
};

export function AdminServiceDetailPage() {
  const { serviceId } = useParams();
  const { services, customer, updateService, addMessage } = usePortalStore();
  const service = services.find((item) => item.id === serviceId);
  const [offerItems, setOfferItems] = useState<PriceOfferItem[]>([]);
  const [visibleNote, setVisibleNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [messageText, setMessageText] = useState("");
  const [callCenterForm, setCallCenterForm] = useState<CallCenterForm>(emptyCallCenterForm);

  useEffect(() => {
    if (!service) {
      return;
    }

    setOfferItems(
      service.priceOffer?.items?.length
        ? service.priceOffer.items
        : [
            {
              id: "item-1",
              title: service.priceOffer?.title ?? "",
              amount: service.priceOffer?.amount ?? 0,
            },
          ],
    );
  }, [service]);

  useEffect(() => {
    if (!service) {
      return;
    }

    setCallCenterForm({
      contactName: service.contactName ?? customer.name,
      contactPhone: service.contactPhone ?? customer.phone,
      contactEmail: service.contactEmail ?? customer.email,
      productCategory: service.productCategory,
      brand: service.brand,
      model: service.model,
      serialNo: service.serialNo,
      warranty: service.warranty,
      issueTitle: service.issueTitle,
      description: service.description,
      urgency: service.urgency,
      preference: service.preference,
      address: service.address,
      appointment: service.appointment,
      technician: service.technician,
      estimatedDelivery: service.estimatedDelivery,
    });
  }, [customer.email, customer.name, customer.phone, service]);

  const offerTotal = useMemo(
    () => offerItems.reduce((total, item) => total + item.amount, 0),
    [offerItems],
  );

  if (!service) {
    return <h1 className="text-2xl font-black">Servis kaydı bulunamadı</h1>;
  }

  const approvedOfferTotal = service.priceOffer?.items
    ? sumOfferItemsByStatus(service.priceOffer.items, "Onaylandı")
    : service.priceOffer?.status === "Onaylandı"
      ? service.priceOffer.amount
      : 0;
  const pendingOfferTotal = service.priceOffer?.items
    ? sumOfferItemsByStatus(service.priceOffer.items, "Bekliyor")
    : service.priceOffer?.status === "Bekliyor"
      ? service.priceOffer.amount
      : 0;
  const rejectedOfferTotal = service.priceOffer?.items
    ? sumOfferItemsByStatus(service.priceOffer.items, "Reddedildi")
    : service.priceOffer?.status === "Reddedildi"
      ? service.priceOffer.amount
      : 0;

  const updateOfferItem = (id: string, updates: Partial<PriceOfferItem>) => {
    setOfferItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const addOfferItem = () => {
    setOfferItems((items) => [
      ...items,
      { id: `item-${Date.now()}`, title: "", amount: 0 },
    ]);
  };

  const removeOfferItem = (id: string) => {
    setOfferItems((items) =>
      items.length > 1 ? items.filter((item) => item.id !== id) : items,
    );
  };

  const savePriceOffer = () => {
    const validItems = offerItems.filter((item) => item.title.trim() && item.amount > 0);
    if (!validItems.length) {
      return;
    }

    const nextStatus = "Fiyat Onayı Bekleniyor";
    const itemsWithStatus = validItems.map((item) => {
      const existingItem = service.priceOffer?.items?.find((offerItem) => offerItem.id === item.id);
      const shouldResetStatus =
        !existingItem ||
        existingItem.title !== item.title ||
        existingItem.amount !== item.amount;

      return {
        ...item,
        status: shouldResetStatus ? "Bekliyor" as PriceOfferStatus : existingItem.status ?? "Bekliyor",
      };
    });
    const offerStatus = itemsWithStatus.some((item) => item.status === "Bekliyor")
      ? "Bekliyor"
      : itemsWithStatus.some((item) => item.status === "Onaylandı")
        ? "Onaylandı"
        : "Reddedildi";

    updateService(service.id, {
      priceOffer: {
        title: itemsWithStatus.map((item) => item.title).join(", "),
        amount: sumOfferItemsByStatus(itemsWithStatus, "Onaylandı"),
        status: offerStatus,
        items: itemsWithStatus,
      },
      currentStatus: nextStatus,
      timeline: buildTimelineForStatus(
        service.timeline,
        nextStatus,
        "Fiyat teklifi oluşturuldu ve müşteri onayına sunuldu.",
      ),
    });
  };

  const changeStatus = (status: ServiceStatus) => {
    updateService(service.id, {
      currentStatus: status,
      timeline: buildTimelineForStatus(service.timeline, status),
    });
  };

  const saveOperationDetails = () => {
    const customerNote = visibleNote.trim();
    const privateNote = internalNote.trim();
    updateService(service.id, {
      technician: callCenterForm.technician,
      currentStatus: service.currentStatus,
      timeline: buildTimelineForStatus(service.timeline, service.currentStatus),
      visibleNotes: customerNote
        ? [...service.visibleNotes, customerNote]
        : service.visibleNotes,
      internalNotes: [
        ...service.internalNotes,
        ...(privateNote ? [privateNote] : []),
        `Operasyon bilgileri kaydedildi: ${new Date().toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        })}`,
      ],
    });
    setVisibleNote("");
    setInternalNote("");
  };

  const updateCallCenterField = <Key extends keyof CallCenterForm>(
    field: Key,
    value: CallCenterForm[Key],
  ) => {
    setCallCenterForm((current) => ({ ...current, [field]: value }));
  };

  const saveCallCenterDetails = () => {
    updateService(service.id, {
      ...callCenterForm,
      internalNotes: [
        ...service.internalNotes,
        `Çağrı merkezi bilgileri güncellendi: ${new Date().toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        })}`,
      ],
    });
  };

  const saveVisibleNote = () => {
    const note = visibleNote.trim();
    if (!note) {
      return;
    }

    updateService(service.id, {
      visibleNotes: [...service.visibleNotes, note],
    });
    setVisibleNote("");
  };

  const saveInternalNote = () => {
    const note = internalNote.trim();
    if (!note) {
      return;
    }

    updateService(service.id, {
      internalNotes: [...service.internalNotes, note],
    });
    setInternalNote("");
  };

  const sendTechnicianMessage = () => {
    const text = messageText.trim();
    if (!text) {
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      from: "technician",
      text,
      time: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    addMessage(service.id, message);
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">{service.trackingNo}</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Servis detay yönetimi</h1>
          <p className="mt-2 text-slate-600">{service.brand} {service.model} - {service.issueTitle}</p>
        </div>
        <Badge tone="amber">{service.currentStatus}</Badge>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="grid gap-4 p-5 md:grid-cols-2">
            <Info title="Müşteri" value={service.contactName ?? customer.name} />
            <Info title="Telefon" value={service.contactPhone ?? customer.phone} />
            <Info title="E-posta" value={service.contactEmail ?? customer.email} />
            <Info title="Ürün" value={`${service.productCategory} / ${service.brand} ${service.model}`} />
            <Info title="Seri no" value={service.serialNo} />
            <Info title="Servis tipi" value={service.preference} />
            <Info title="Randevu" value={service.appointment} />
          </Card>

          <Card className="space-y-4 p-5">
            <div>
              <h2 className="text-xl font-black text-slate-950">Çağrı merkezi bilgileri</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Müşteri arandıktan sonra eksik servis, adres ve cihaz bilgilerini buradan tamamlayın.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Ad soyad">
                <Input
                  value={callCenterForm.contactName ?? ""}
                  onChange={(event) => updateCallCenterField("contactName", event.target.value)}
                />
              </Field>
              <Field label="Telefon">
                <Input
                  value={callCenterForm.contactPhone ?? ""}
                  onChange={(event) => updateCallCenterField("contactPhone", event.target.value)}
                />
              </Field>
              <Field label="E-posta">
                <Input
                  value={callCenterForm.contactEmail ?? ""}
                  onChange={(event) => updateCallCenterField("contactEmail", event.target.value)}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Ürün / kategori">
                <Input
                  placeholder="Notebook, yazıcı, masaüstü..."
                  value={callCenterForm.productCategory}
                  onChange={(event) => updateCallCenterField("productCategory", event.target.value)}
                />
              </Field>
              <Field label="Marka">
                <Input
                  placeholder="HP, Lenovo, Epson..."
                  value={callCenterForm.brand}
                  onChange={(event) => updateCallCenterField("brand", event.target.value)}
                />
              </Field>
              <Field label="Model">
                <Input
                  value={callCenterForm.model}
                  onChange={(event) => updateCallCenterField("model", event.target.value)}
                />
              </Field>
              <Field label="Seri no">
                <Input
                  value={callCenterForm.serialNo}
                  onChange={(event) => updateCallCenterField("serialNo", event.target.value)}
                />
              </Field>
              <Field label="Garanti durumu">
                <select
                  className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={callCenterForm.warranty}
                  onChange={(event) => updateCallCenterField("warranty", event.target.value)}
                >
                  <option>Telefonla netleştirilecek</option>
                  <option>Garanti kapsamında</option>
                  <option>Garanti dışı</option>
                  <option>Emin değil</option>
                </select>
              </Field>
              <Field label="Aciliyet">
                <select
                  className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={callCenterForm.urgency}
                  onChange={(event) => updateCallCenterField("urgency", event.target.value as Urgency)}
                >
                  <option>Normal</option>
                  <option>Acil</option>
                  <option>Kritik</option>
                </select>
              </Field>
            </div>
            <Field label="Sorun başlığı">
              <Input
                value={callCenterForm.issueTitle}
                onChange={(event) => updateCallCenterField("issueTitle", event.target.value)}
              />
            </Field>
            <Field label="Detaylı açıklama">
              <Textarea
                value={callCenterForm.description}
                onChange={(event) => updateCallCenterField("description", event.target.value)}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Servis tercihi">
                <select
                  className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={callCenterForm.preference}
                  onChange={(event) => updateCallCenterField("preference", event.target.value as ServicePreference)}
                >
                  <option>Mümkünse Yerinde Servis İstiyorum</option>
                  <option>Ürün adresten alınsın</option>
                  <option>Kendim servise bırakacağım</option>
                </select>
              </Field>
              <Field label="Servis zamanı / randevu">
                <Input
                  placeholder="Örn. 16 Mayıs 2026, 14:00 - 16:00"
                  value={callCenterForm.appointment}
                  onChange={(event) => updateCallCenterField("appointment", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Adres">
              <Textarea
                placeholder="Yerinde servis veya adresten alım için açık adres"
                value={callCenterForm.address}
                onChange={(event) => updateCallCenterField("address", event.target.value)}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Teknisyen">
                <Input
                  value={callCenterForm.technician}
                  onChange={(event) => updateCallCenterField("technician", event.target.value)}
                />
              </Field>
              <Field label="Tahmini teslim">
                <Input
                  value={callCenterForm.estimatedDelivery}
                  onChange={(event) => updateCallCenterField("estimatedDelivery", event.target.value)}
                />
              </Field>
            </div>
            <Button type="button" onClick={saveCallCenterDetails}>
              Çağrı merkezi bilgilerini kaydet
            </Button>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-xl font-black text-slate-950">Operasyon</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Durum değiştir">
                <select
                  className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={service.currentStatus}
                  onChange={(event) => changeStatus(event.target.value as ServiceStatus)}
                >
                  {serviceStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Teknisyen atama">
                <Input
                  value={callCenterForm.technician}
                  onChange={(event) => updateCallCenterField("technician", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Müşteriye görünür not">
              <Textarea
                placeholder="Müşterinin göreceği servis notu"
                value={visibleNote}
                onChange={(event) => setVisibleNote(event.target.value)}
              />
            </Field>
            {service.visibleNotes.length ? (
              <div className="space-y-2">
                {service.visibleNotes.map((note) => (
                  <p key={note} className="rounded-lg bg-brand-50 p-3 text-sm leading-6 text-brand-800">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}
            <Button type="button" variant="secondary" disabled={!visibleNote.trim()} onClick={saveVisibleNote}>
              Müşteri notunu kaydet
            </Button>
            <Field label="İç not">
              <Textarea
                placeholder="Sadece admin/teknisyen ekibi görür"
                value={internalNote}
                onChange={(event) => setInternalNote(event.target.value)}
              />
            </Field>
            {service.internalNotes.length ? (
              <div className="space-y-2">
                {service.internalNotes.map((note) => (
                  <p key={note} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}
            <Button type="button" variant="secondary" disabled={!internalNote.trim()} onClick={saveInternalNote}>
              İç notu kaydet
            </Button>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <UploadCloud className="mx-auto text-brand-600" size={28} />
              <p className="mt-2 text-sm font-bold text-slate-700">Fotoğraf/video yükleme</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={saveOperationDetails}>
                Operasyonu ve notları kaydet
              </Button>
              <Button type="button" variant="secondary">
                <Send size={18} />
                SMS gönder
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">Fiyat teklifi oluşturma</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Teklife birden fazla işlem kalemi ekleyebilirsiniz.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={addOfferItem}>
                <Plus size={18} />
                Kalem ekle
              </Button>
            </div>
            <div className="space-y-3">
              {offerItems.map((item, index) => (
                <div key={item.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[1fr_180px_44px]">
                  <Field label={`İşlem kalemi ${index + 1}`}>
                    <Input
                      placeholder="Örn. SSD değişimi"
                      value={item.title}
                      onChange={(event) => updateOfferItem(item.id, { title: event.target.value })}
                    />
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Durum: {item.status ?? "Bekliyor"}
                    </p>
                  </Field>
                  <Field label="Tutar">
                    <Input
                      inputMode="numeric"
                      placeholder="0₺"
                      value={item.amount ? formatCurrency(item.amount) : ""}
                      onChange={(event) =>
                        updateOfferItem(item.id, {
                          amount: Number(event.target.value.replace(/\D/g, "")),
                        })
                      }
                    />
                  </Field>
                  <button
                    className="mt-7 grid h-12 w-11 place-items-center rounded-lg bg-white text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={offerItems.length === 1}
                    onClick={() => removeOfferItem(item.id)}
                    type="button"
                    aria-label="İşlem kalemini sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-brand-50 p-4">
              <div>
                <p className="text-sm font-semibold text-brand-700">Teklif toplamı</p>
                <p className="mt-1 text-2xl font-black text-brand-900">
                  {formatCurrency(offerTotal)}
                </p>
              </div>
              <Button type="button" disabled={offerTotal <= 0} onClick={savePriceOffer}>
                Teklifi kaydet
              </Button>
            </div>
            {service.priceOffer ? (
              <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700 md:grid-cols-3">
                <p>Nihai onaylı tutar: {formatCurrency(approvedOfferTotal)}</p>
                <p>Bekleyen tutar: {formatCurrency(pendingOfferTotal)}</p>
                <p>Reddedilen tutar: {formatCurrency(rejectedOfferTotal)}</p>
              </div>
            ) : null}
          </Card>
        </div>

        <Card className="flex min-h-[620px] flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-black text-slate-950">Müşteriyle mesajlaşma</h2>
            <p className="text-sm text-slate-500">
              {service.contactName ?? customer.name} · {service.contactPhone ?? customer.phone}
            </p>
          </div>
          <div className="flex-1 space-y-3 bg-slate-50 p-4">
            {service.messages.map((message) => (
              <div key={message.id} className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-6 ${message.from === "technician" ? "ml-auto bg-brand-600 text-white" : "bg-white text-slate-800"}`}>
                {message.text}
                <span className="mt-1 block text-right text-[11px] opacity-70">{message.time}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <Input
              placeholder="Müşteriye mesaj yazın"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendTechnicianMessage();
                }
              }}
            />
            <Button className="w-12 px-0" aria-label="Gönder" disabled={!messageText.trim()} onClick={sendTechnicianMessage}>
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}
