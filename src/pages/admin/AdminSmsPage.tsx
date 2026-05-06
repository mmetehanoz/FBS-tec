import { BellRing, Send } from "lucide-react";
import { Button, Card, Field, Input, Textarea } from "../../components/ui";

export function AdminSmsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">SMS bildirimleri</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Müşteri bilgilendirme</h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="space-y-4 p-5">
          <Field label="Telefon numarası">
            <Input placeholder="+90 5__ ___ __ __" />
          </Field>
          <Field label="Mesaj">
            <Textarea placeholder="FBS servis bilgilendirme mesajı" />
          </Field>
          <Button>
            <Send size={18} />
            SMS gönder
          </Button>
        </Card>
        <Card className="p-5">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <BellRing size={24} />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-950">Mock SMS paneli</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Backend bağlı olmadığından gönderim simüle edilir. Route ve arayüz gerçek entegrasyona hazırdır.
          </p>
        </Card>
      </div>
    </div>
  );
}
