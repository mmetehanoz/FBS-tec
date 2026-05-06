import { Paperclip, Send } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button, Card, Input } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";

export function MessagesPage() {
  const service = usePortalStore((state) => state.services[0]);

  return (
    <div>
      <PageHeader
        eyebrow="Mesajlar"
        title="Teknik servis görüşmesi"
        description={`${service.trackingNo} numaralı servis kaydı için görüşme.`}
      />
      <div className="px-5 pb-6">
        <Card className="flex min-h-[620px] flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-black text-slate-950">{service.technician}</h2>
            <p className="text-sm text-slate-500">FBS teknik servis</p>
          </div>
          <div className="flex-1 space-y-3 bg-slate-50 p-4">
            {service.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
                  message.from === "customer"
                    ? "ml-auto bg-brand-600 text-white"
                    : "bg-white text-slate-800"
                }`}
              >
                {message.text}
                <span className="mt-1 block text-right text-[11px] opacity-70">{message.time}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <Button variant="secondary" className="w-12 px-0" aria-label="Dosya gönder">
              <Paperclip size={18} />
            </Button>
            <Input placeholder="Mesaj yazın" />
            <Button className="w-12 px-0" aria-label="Mesaj gönder">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
