import { CheckCircle2, Clock3, PackageCheck, WalletCards } from "lucide-react";
import { Card } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";

export function AdminDashboardPage() {
  const services = usePortalStore((state) => state.services);
  const serviceApiStatus = usePortalStore((state) => state.serviceApiStatus);
  const stats = [
    { label: "Yeni talepler", value: services.filter((s) => s.currentStatus === "Talep Alındı").length, icon: Clock3 },
    { label: "Devam eden servisler", value: services.filter((s) => s.currentStatus !== "Teslim Edildi").length, icon: CheckCircle2 },
    { label: "Onay bekleyen fiyat teklifleri", value: services.filter((s) => s.currentStatus.includes("Onay")).length, icon: WalletCards },
    { label: "Teslime hazır ürünler", value: services.filter((s) => s.currentStatus === "Teslime Hazır").length, icon: PackageCheck },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Dashboard</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Bugünkü servis operasyonu</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Veri durumu: {serviceApiStatus === "ready" ? "Backend bağlantısı aktif" : serviceApiStatus === "loading" ? "Backend yükleniyor" : serviceApiStatus === "error" ? "Backend kapalı, yerel mock gösteriliyor" : "Hazır"}
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{stat.value}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h2 className="text-xl font-black text-slate-950">Bugünkü servis hareketleri</h2>
        <div className="mt-4 space-y-3">
          {services.flatMap((service) => service.timeline.slice(-1).map((item) => (
            <div key={`${service.id}-${item.status}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-black text-slate-950">{service.trackingNo}</p>
                <p className="text-sm text-slate-600">{item.note}</p>
              </div>
              <p className="text-sm font-bold text-brand-700">{item.date}</p>
            </div>
          )))}
        </div>
      </Card>
    </div>
  );
}
