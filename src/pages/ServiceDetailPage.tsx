import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Timeline } from "../components/Timeline";
import { Badge, Button, Card, Input } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";
import type { Message, PriceOfferItem, PriceOfferStatus } from "../types";
import { formatCurrency, sumOfferItemsByStatus } from "../utils/service";
import { buildTimelineForStatus } from "../utils/timeline";

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = usePortalStore((state) => state.services.find((item) => item.id === serviceId));
  const loadServices = usePortalStore((state) => state.loadServices);
  const addMessage = usePortalStore((state) => state.addMessage);
  const updateService = usePortalStore((state) => state.updateService);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    void loadServices();
    const intervalId = window.setInterval(() => {
      void loadServices();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadServices]);

  if (!service) {
    return <PageHeader title="Servis kaydı bulunamadı" description="Takip numarasını kontrol edin." />;
  }

  const timeline = buildTimelineForStatus(service.timeline, service.currentStatus);
  const offerItems = service.priceOffer?.items?.length
    ? service.priceOffer.items
    : service.priceOffer
      ? [{
          id: "item-legacy",
          title: service.priceOffer.title,
          amount: service.priceOffer.amount,
          status: service.priceOffer.status,
        }]
      : [];
  const approvedOfferTotal = sumOfferItemsByStatus(offerItems, "Onaylandı");
  const pendingOfferTotal = sumOfferItemsByStatus(offerItems, "Bekliyor");
  const rejectedOfferTotal = sumOfferItemsByStatus(offerItems, "Reddedildi");

  const getOfferStatus = (items: PriceOfferItem[]): PriceOfferStatus => {
    if (items.some((item) => (item.status ?? "Bekliyor") === "Bekliyor")) {
      return "Bekliyor";
    }

    return items.some((item) => item.status === "Onaylandı") ? "Onaylandı" : "Reddedildi";
  };

  const updatePriceOfferItemStatus = (itemId: string, status: PriceOfferStatus) => {
    if (!service.priceOffer) {
      return;
    }

    const items = service.priceOffer.items?.length
      ? service.priceOffer.items
      : [
          {
            id: "item-legacy",
            title: service.priceOffer.title,
            amount: service.priceOffer.amount,
            status: service.priceOffer.status,
          },
        ];
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, status } : { ...item, status: item.status ?? "Bekliyor" },
    );
    const offerStatus = getOfferStatus(updatedItems);
    const hasApprovedItem = updatedItems.some((item) => item.status === "Onaylandı");
    const nextStatus = hasApprovedItem ? "Onarım Başladı" : service.currentStatus;

    updateService(service.id, {
      priceOffer: {
        ...service.priceOffer,
        status: offerStatus,
        amount: sumOfferItemsByStatus(updatedItems, "Onaylandı"),
        items: updatedItems,
      },
      currentStatus: nextStatus,
      visibleNotes: [
        ...service.visibleNotes,
        `${updatedItems.find((item) => item.id === itemId)?.title ?? "Teklif kalemi"} ${status.toLowerCase()}.`,
      ],
      timeline: buildTimelineForStatus(
        service.timeline,
        nextStatus,
        hasApprovedItem
          ? "Müşteri en az bir fiyat teklifi kalemini onayladı. Onarım süreci başlatıldı."
          : "Müşteri fiyat teklifi kalemine dönüş yaptı.",
      ),
    });
  };

  const sendCustomerMessage = () => {
    const text = messageText.trim();
    if (!text) {
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      from: "customer",
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
          <Timeline items={timeline} />
        </Card>

        {service.priceOffer ? (
          <Card className="p-4">
            <p className="text-sm font-semibold text-slate-500">Fiyat teklifi</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-950">Nihai onaylı tutar</h2>
                <p className="mt-1 text-2xl font-black text-brand-700">
                  {formatCurrency(approvedOfferTotal)}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  Bekleyen: {formatCurrency(pendingOfferTotal)} · Reddedilen: {formatCurrency(rejectedOfferTotal)}
                </p>
              </div>
              <Badge tone="amber">{service.priceOffer.status}</Badge>
            </div>
            {offerItems.map((item) => {
              const itemStatus = item.status ?? "Bekliyor";

              return (
                <div
                  key={item.id}
                  className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-700">{item.title}</span>
                      <span className="mt-1 block text-lg font-black text-slate-950">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <Badge tone={itemStatus === "Onaylandı" ? "blue" : itemStatus === "Reddedildi" ? "rose" : "amber"}>
                      {itemStatus}
                    </Badge>
                  </div>
                  {itemStatus === "Bekliyor" ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={() => updatePriceOfferItemStatus(item.id, "Onaylandı")}
                      >
                        Onayla
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => updatePriceOfferItemStatus(item.id, "Reddedildi")}
                      >
                        Reddet
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Card>
        ) : null}

        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Teknik servis notları</h2>
          <div className="mt-3 space-y-2">
            {service.visibleNotes.length ? service.visibleNotes.map((note) => (
              <p key={note} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {note}
              </p>
            )) : (
              <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-500">
                Teknik servis henüz müşteriye görünür not eklemedi.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Yüklenen fotoğraflar</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {service.photos.length ? service.photos.map((photo) => (
              <img
                key={photo}
                alt="Servis fotoğrafı"
                className="aspect-[4/3] rounded-lg object-cover"
                src={photo}
              />
            )) : (
              <p className="col-span-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-500">
                Henüz fotoğraf yüklenmedi.
              </p>
            )}
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
            <Input
              placeholder="Mesaj yazın"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendCustomerMessage();
                }
              }}
            />
            <Button className="w-14 px-0" aria-label="Mesaj gönder" disabled={!messageText.trim()} onClick={sendCustomerMessage}>
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
