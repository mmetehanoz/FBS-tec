import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";
import type { Message, ServiceRecord } from "../../types";
import { cn } from "../../utils/cn";

const getCustomerName = (service: ServiceRecord) =>
  service.contactName?.trim() || service.customerId || "Müşteri";

const getLastMessage = (service: ServiceRecord) =>
  service.messages.at(-1)?.text || service.visibleNotes.at(-1) || service.issueTitle;

const getLastMessageTime = (service: ServiceRecord) =>
  service.messages.at(-1)?.time || service.lastUpdate;

const getMessageTimestamp = (service: ServiceRecord) => {
  const lastMessageId = service.messages.at(-1)?.id;
  const timestamp = lastMessageId?.startsWith("msg-")
    ? Number(lastMessageId.replace("msg-", ""))
    : 0;

  return Number.isFinite(timestamp) ? timestamp : 0;
};

export function AdminMessagesPage() {
  const services = usePortalStore((state) => state.services);
  const addMessage = usePortalStore((state) => state.addMessage);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = useMemo(
    () =>
      [...services].sort((first, second) => {
        const secondTime = getMessageTimestamp(second);
        const firstTime = getMessageTimestamp(first);

        if (secondTime !== firstTime) {
          return secondTime - firstTime;
        }

        return second.lastUpdate.localeCompare(first.lastUpdate);
      }),
    [services],
  );

  const filteredConversations = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return conversations;
    }

    return conversations.filter((service) => {
      const haystack = [
        service.trackingNo,
        getCustomerName(service),
        service.contactPhone,
        service.issueTitle,
        service.productCategory,
        service.model,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return haystack.includes(query);
    });
  }, [conversations, searchTerm]);

  useEffect(() => {
    if (!selectedServiceId && filteredConversations[0]) {
      setSelectedServiceId(filteredConversations[0].id);
    }

    if (
      selectedServiceId &&
      filteredConversations.length > 0 &&
      !filteredConversations.some((service) => service.id === selectedServiceId)
    ) {
      setSelectedServiceId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedServiceId]);

  const selectedService =
    filteredConversations.find((service) => service.id === selectedServiceId) ??
    conversations.find((service) => service.id === selectedServiceId) ??
    filteredConversations[0];

  const sendTechnicianMessage = () => {
    const text = messageText.trim();

    if (!text || !selectedService) {
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

    addMessage(selectedService.id, message);
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Mesajlar</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Servis görüşmeleri</h1>
      </header>

      <Card className="grid min-h-[720px] overflow-hidden lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                className="pl-11"
                placeholder="Müşteri, telefon veya takip no ara"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {filteredConversations.map((service) => {
              const isActive = service.id === selectedService?.id;
              const unreadFromCustomer = service.messages.at(-1)?.from === "customer";

              return (
                <button
                  key={service.id}
                  className={cn(
                    "flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50",
                    isActive && "bg-brand-50 hover:bg-brand-50",
                  )}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                >
                  <div
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-black",
                      isActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {getCustomerName(service).slice(0, 1).toLocaleUpperCase("tr-TR")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-950">
                          {getCustomerName(service)}
                        </p>
                        <p className="truncate text-xs font-bold text-brand-700">
                          {service.trackingNo}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                        {getLastMessageTime(service)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          unreadFromCustomer ? "font-black text-slate-900" : "text-slate-500",
                        )}
                      >
                        {getLastMessage(service)}
                      </p>
                      {unreadFromCustomer ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 ? (
              <div className="p-6 text-sm font-semibold text-slate-500">
                Aramanızla eşleşen görüşme bulunamadı.
              </div>
            ) : null}
          </div>
        </aside>

        {selectedService ? (
          <section className="flex min-h-[720px] flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white p-4">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black text-slate-950">
                  {getCustomerName(selectedService)}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {selectedService.trackingNo} · {selectedService.issueTitle}
                </p>
              </div>
              <div className="hidden rounded-lg bg-slate-50 px-4 py-3 text-right text-xs font-bold text-slate-500 sm:block">
                <p>{selectedService.contactPhone || "Telefon yok"}</p>
                <p className="mt-1 text-brand-700">{selectedService.currentStatus}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
              {selectedService.messages.length > 0 ? (
                selectedService.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm",
                      message.from === "technician"
                        ? "ml-auto bg-brand-600 text-white"
                        : "bg-white text-slate-800",
                    )}
                  >
                    {message.text}
                    <span className="mt-1 block text-right text-[11px] opacity-70">
                      {message.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
                      <MessageCircle size={24} />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-600">
                      Bu servis kaydında henüz mesaj yok.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-slate-100 bg-white p-3">
              <Input
                placeholder={`${getCustomerName(selectedService)} için yanıt yazın`}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendTechnicianMessage();
                  }
                }}
              />
              <Button
                className="w-12 px-0 sm:w-auto sm:px-5"
                aria-label="Gönder"
                disabled={!messageText.trim()}
                onClick={sendTechnicianMessage}
              >
                <Send size={18} />
                <span className="hidden sm:inline">Gönder</span>
              </Button>
            </div>
          </section>
        ) : (
          <section className="grid min-h-[720px] place-items-center bg-slate-50 p-6 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
                <MessageCircle size={24} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-600">
                Henüz servis görüşmesi bulunmuyor.
              </p>
            </div>
          </section>
        )}
      </Card>
    </div>
  );
}
