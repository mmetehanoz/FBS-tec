import { useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { ServiceCard } from "../components/ServiceCard";
import { usePortalStore } from "../hooks/usePortalStore";

export function ServiceTrackPage() {
  const services = usePortalStore((state) => state.services);
  const loadServices = usePortalStore((state) => state.loadServices);
  const serviceApiStatus = usePortalStore((state) => state.serviceApiStatus);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  return (
    <div>
      <PageHeader
        eyebrow="Servis takip"
        title="Aktif servis kayıtlarınız"
        description="Cihazlarınızın güncel durumunu ve bekleyen onayları buradan izleyebilirsiniz."
      />
      <div className="space-y-4 px-5 pb-6">
        {serviceApiStatus === "loading" ? (
          <div className="rounded-lg bg-brand-50 p-4 text-sm font-bold text-brand-700">
            Servis kayıtları backend üzerinden yükleniyor...
          </div>
        ) : null}
        {serviceApiStatus === "error" ? (
          <div className="rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-700">
            Mock API’ye ulaşılamadı; ekrandaki yerel örnek kayıtlar gösteriliyor.
          </div>
        ) : null}
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
