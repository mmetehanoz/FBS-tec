import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge, Card } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";

export function AdminRequestsPage() {
  const services = usePortalStore((state) => state.services);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Servis talepleri</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Tüm servis kayıtları</h1>
      </header>
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_1.2fr_1fr_1fr_48px] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-black text-slate-500 lg:grid">
          <span>Takip no</span>
          <span>Ürün</span>
          <span>Müşteri</span>
          <span>Durum</span>
          <span />
        </div>
        {services.map((service) => (
          <div key={service.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-0 lg:grid-cols-[1fr_1.2fr_1fr_1fr_48px] lg:items-center">
            <p className="font-black text-brand-700">{service.trackingNo}</p>
            <div>
              <p className="font-black text-slate-950">{service.brand} {service.model}</p>
              <p className="text-sm text-slate-500">{service.issueTitle}</p>
            </div>
            <p className="text-sm font-semibold text-slate-700">{service.customerId}</p>
            <Badge tone={service.currentStatus.includes("Onay") ? "amber" : "blue"}>{service.currentStatus}</Badge>
            <Link className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700" to={`/admin/servis/${service.id}`} aria-label="Yönet">
              <ArrowRight size={19} />
            </Link>
          </div>
        ))}
      </Card>
    </div>
  );
}
