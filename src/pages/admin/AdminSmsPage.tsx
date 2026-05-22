import { useEffect, useState } from "react";
import { BellRing, Plus, Save, Send, Trash2 } from "lucide-react";
import { Button, Card, Field, Input, Textarea } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";
import { serviceApi } from "../../lib/api";
import type { SmsTemplate } from "../../lib/api";
import type { Customer } from "../../types";

const getCustomerLabel = (customer: Customer) =>
  `${customer.name || "İsimsiz müşteri"}${customer.phone ? ` - ${customer.phone}` : ""}`;

export function AdminSmsPage() {
  const customers = usePortalStore((state) => state.customers);
  const loadCustomers = usePortalStore((state) => state.loadCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [sendStatus, setSendStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  useEffect(() => {
    void loadCustomers();
    serviceApi.listSmsTemplates().then(setTemplates).catch(() => undefined);
  }, [loadCustomers]);

  const selectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = customers.find((item) => item.id === customerId);

    if (customer) {
      setPhone(customer.phone);
    }
  };

  const addTemplate = async () => {
    const title = templateTitle.trim();
    const nextMessage = templateMessage.trim();

    if (!title || !nextMessage) {
      return;
    }

    setIsAddingTemplate(true);

    try {
      const created = await serviceApi.createSmsTemplate({ title, message: nextMessage });
      setTemplates((current) => [created, ...current]);
      setTemplateTitle("");
      setTemplateMessage("");
    } catch {
      // silently ignore; backend unavailable
    } finally {
      setIsAddingTemplate(false);
    }
  };

  const removeTemplate = async (templateId: string) => {
    setTemplates((current) => current.filter((t) => t.id !== templateId));

    try {
      await serviceApi.deleteSmsTemplate(templateId);
    } catch {
      // rollback
      serviceApi.listSmsTemplates().then(setTemplates).catch(() => undefined);
    }
  };

  const sendSms = async () => {
    if (!phone.trim() || !message.trim()) {
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      await serviceApi.sendSms({
        phone: phone.trim(),
        message: message.trim(),
        customerId: selectedCustomerId || undefined,
      });
      setSendStatus({ ok: true, text: "SMS başarıyla gönderildi." });
      setMessage("");
    } catch {
      setSendStatus({ ok: false, text: "SMS gönderilemedi. NetGSM bağlantısını kontrol edin." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          SMS bildirimleri
        </p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Müşteri bilgilendirme</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <div>
              <h2 className="text-xl font-black text-slate-950">SMS gönder</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Kayıtlı müşteriyi seçin veya telefon numarasını manuel girin.
              </p>
            </div>

            <Field label="Müşteri seç">
              <select
                className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                value={selectedCustomerId}
                onChange={(event) => selectCustomer(event.target.value)}
              >
                <option value="">Müşteri seçin</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {getCustomerLabel(customer)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Telefon numarası">
              <Input
                placeholder="+90 ___ ___ __ __"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>

            <Field label="Mesaj">
              <Textarea
                placeholder="FBS servis bilgilendirme mesajı"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>

            <Button type="button" disabled={!phone.trim() || !message.trim() || isSending} onClick={() => void sendSms()}>
              <Send size={18} />
              {isSending ? "Gönderiliyor..." : "SMS gönder"}
            </Button>

            {sendStatus ? (
              <p className={`rounded-lg p-3 text-sm font-bold ${sendStatus.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {sendStatus.text}
              </p>
            ) : null}
          </Card>

          <Card className="space-y-4 p-5">
            <div>
              <h2 className="text-xl font-black text-slate-950">Hazır SMS oluştur</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Kaydettiğiniz hazır SMS kutuları aşağıda görünür. Kutuyu seçince mesaj alanına aktarılır.
              </p>
            </div>

            <Field label="Başlık">
              <Input
                placeholder="Örn. Fiyat onayı bekliyor"
                value={templateTitle}
                onChange={(event) => setTemplateTitle(event.target.value)}
              />
            </Field>

            <Field label="Hazır SMS metni">
              <Textarea
                placeholder="Müşteriye gönderilecek hazır SMS metni"
                value={templateMessage}
                onChange={(event) => setTemplateMessage(event.target.value)}
              />
            </Field>

            <Button
              type="button"
              variant="secondary"
              disabled={!templateTitle.trim() || !templateMessage.trim() || isAddingTemplate}
              onClick={() => void addTemplate()}
            >
              <Save size={18} />
              {isAddingTemplate ? "Kaydediliyor..." : "Hazır SMS kaydet"}
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <BellRing size={24} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">NetGSM SMS paneli</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Müşteri seçip mesaj yazarak direkt NetGSM üzerinden SMS gönderebilirsiniz. Tüm gönderimler
              SMS Kayıtları'nda loglanır.
            </p>
          </Card>

          <Card className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">Hazır SMS kutuları</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {templates.length}
              </span>
            </div>

            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <button
                  className="block w-full text-left"
                  type="button"
                  onClick={() => setMessage(template.message)}
                >
                  <h3 className="font-black text-slate-950">{template.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {template.message}
                  </p>
                </button>
                <div className="mt-3 flex gap-2">
                  <Button
                    className="min-h-10 px-3 py-2"
                    type="button"
                    variant="secondary"
                    onClick={() => setMessage(template.message)}
                  >
                    <Plus size={16} />
                    Mesaja aktar
                  </Button>
                  <Button
                    className="min-h-10 px-3 py-2"
                    type="button"
                    variant="ghost"
                    onClick={() => void removeTemplate(template.id)}
                  >
                    <Trash2 size={16} />
                    Sil
                  </Button>
                </div>
              </div>
            ))}

            {!templates.length ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Henüz hazır SMS yok. Soldaki formdan yeni hazır SMS oluşturabilirsiniz.
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

