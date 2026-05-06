import { useEffect } from "react";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Timeline } from "../components/Timeline";
import { Badge, Button, Card, Input } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";
import { formatCurrency } from "../utils/service";

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = usePortalStore((state) => state.services.find((item) => item.id === serviceId));
  const loadServices = usePortalStore((state) => state.loadServices);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  if (!service) {
    return <PageHeader title="Servis kaydı bulunamadı" description="Takip numarasını kontrol edin." />;
  }

  return (
    <div>
      <PageHeader eyebrow={service.trackingNo} title={`${service.brand} ${service.model}`} description={service.issueTitle} />
      <div className="space-y-4 px-5 pb-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Mevcut durum</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{service.currentStatus}</h2>
            </div>
            <Badge tone="blue">{service.urgency}</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 text-lg font-black text-slate-950">Servis zaman çizelgesi</h2>
          <Timeline items={service.timeline} />
        </Card>

        {service.priceOffer ? (
          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-500">Fiyat teklifi</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-950">{service.priceOffer.title}</h2>
                <p className="mt-1 text-2xl font-black text-brand-700">
                  {formatCurrency(service.priceOffer.amount)}
                </p>
              </div>
              <Badge tone="amber">{service.priceOffer.status}</Badge>
            </div>
            {service.priceOffer.items?.length ? (
              <div className="mt-4 space-y-2">
                {service.priceOffer.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm"
                  >
                    <span className="font-bold text-slate-700">{item.title}</span>
                    <span className="font-black text-slate-950">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <Button className="mt-4 w-full">Teklifi onayla</Button>
          </Card>
        ) : null}

        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Teknik servis notları</h2>
          <div className="mt-3 space-y-2">
            {service.visibleNotes.map((note) => (
              <p key={note} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {note}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Yüklenen fotoğraflar</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {service.photos.map((photo) => (
              <img
                key={photo}
                alt="Servis fotoğrafı"
                className="aspect-[4/3] rounded-lg object-cover"
                src={photo}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Teknik servis ile mesajlaşma</h2>
          <div className="mt-4 space-y-3">
            {service.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.from === "customer"
                    ? "ml-auto bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.text}
                <span className="mt-1 block text-right text-[11px] opacity-70">{message.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Mesaj yazın" />
            <Button className="w-14 px-0" aria-label="Mesaj gönder">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
