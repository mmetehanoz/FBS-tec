import { Plus, Send, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { serviceStatuses } from "../../data/mockData";
import { usePortalStore } from "../../hooks/usePortalStore";
import { Badge, Button, Card, Field, Input, Textarea } from "../../components/ui";
import { formatCurrency } from "../../utils/service";
import type { PriceOfferItem } from "../../types";

export function AdminServiceDetailPage() {
  const { serviceId } = useParams();
  const { services, customer, updateService } = usePortalStore();
  const service = services.find((item) => item.id === serviceId);
  const [offerItems, setOfferItems] = useState<PriceOfferItem[]>([]);

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

  const offerTotal = useMemo(
    () => offerItems.reduce((total, item) => total + item.amount, 0),
    [offerItems],
  );

  if (!service) {
    return <h1 className="text-2xl font-black">Servis kaydı bulunamadı</h1>;
  }

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

    updateService(service.id, {
      priceOffer: {
        title: validItems.map((item) => item.title).join(", "),
        amount: validItems.reduce((total, item) => total + item.amount, 0),
        status: service.priceOffer?.status ?? "Bekliyor",
        items: validItems,
      },
      currentStatus: "Fiyat Onayı Bekleniyor",
    });
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
            <Info title="Müşteri" value={customer.name} />
            <Info title="Telefon" value={customer.phone} />
            <Info title="Ürün" value={`${service.productCategory} / ${service.brand} ${service.model}`} />
            <Info title="Seri no" value={service.serialNo} />
            <Info title="Servis tipi" value={service.preference} />
            <Info title="Randevu" value={service.appointment} />
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-xl font-black text-slate-950">Operasyon</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Durum değiştir">
                <select
                  className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={service.currentStatus}
                  onChange={(event) => updateService(service.id, { currentStatus: event.target.value as typeof service.currentStatus })}
                >
                  {serviceStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Teknisyen atama">
                <Input defaultValue={service.technician} />
              </Field>
            </div>
            <Field label="Müşteriye görünür not">
              <Textarea placeholder="Müşterinin göreceği servis notu" />
            </Field>
            <Field label="İç not">
              <Textarea placeholder="Sadece admin/teknisyen ekibi görür" />
            </Field>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <UploadCloud className="mx-auto text-brand-600" size={28} />
              <p className="mt-2 text-sm font-bold text-slate-700">Fotoğraf/video yükleme</p>
            </div>
            <Button>
              <Send size={18} />
              SMS gönder
            </Button>
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
              <p className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700">
                Mevcut teklif: {formatCurrency(service.priceOffer.amount)} - {service.priceOffer.status}
              </p>
            ) : null}
          </Card>
        </div>

        <Card className="flex min-h-[620px] flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-black text-slate-950">Müşteriyle mesajlaşma</h2>
            <p className="text-sm text-slate-500">{customer.name}</p>
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
            <Input placeholder="Müşteriye mesaj yazın" />
            <Button className="w-12 px-0" aria-label="Gönder">
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
