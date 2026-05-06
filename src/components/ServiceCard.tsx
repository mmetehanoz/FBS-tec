import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ServiceRecord } from "../types";
import { Badge, Card } from "./ui";

export function ServiceCard({ service }: { service: ServiceRecord }) {
  const tone =
    service.currentStatus === "Teslime Hazır"
      ? "green"
      : service.urgency === "Kritik"
        ? "rose"
        : service.currentStatus.includes("Onay")
          ? "amber"
          : "blue";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            {service.trackingNo}
          </p>
          <h2 className="text-lg font-black text-slate-950">
            {service.brand} {service.model}
          </h2>
          <Badge tone={tone}>{service.currentStatus}</Badge>
        </div>
        <Link
          to={`/servis/${service.id}`}
          className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-brand-700 transition hover:bg-brand-50"
          aria-label="Servis detayına git"
        >
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <Clock3 size={17} className="text-brand-600" />
          Son güncelleme: {service.lastUpdate}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={17} className="text-brand-600" />
          Tahmini teslim: {service.estimatedDelivery}
        </span>
      </div>
    </Card>
  );
}
