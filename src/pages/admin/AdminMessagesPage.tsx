import { Send } from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";

export function AdminMessagesPage() {
  const service = usePortalStore((state) => state.services[0]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Mesajlar</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Servis görüşmeleri</h1>
      </header>
      <Card className="flex min-h-[680px] flex-col overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <h2 className="font-black text-slate-950">{service.trackingNo}</h2>
          <p className="text-sm text-slate-500">{service.issueTitle}</p>
        </div>
        <div className="flex-1 space-y-3 bg-slate-50 p-5">
          {service.messages.map((message) => (
            <div key={message.id} className={`max-w-xl rounded-lg px-4 py-3 text-sm leading-6 ${message.from === "technician" ? "ml-auto bg-brand-600 text-white" : "bg-white text-slate-800"}`}>
              {message.text}
              <span className="mt-1 block text-right text-[11px] opacity-70">{message.time}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
          <Input placeholder="Yanıt yazın" />
          <Button>
            <Send size={18} />
            Gönder
          </Button>
        </div>
      </Card>
    </div>
  );
}
