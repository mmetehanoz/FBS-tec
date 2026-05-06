import { LogOut, MapPin, Phone, UserRound } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Badge, Button, Card } from "../components/ui";
import { usePortalStore } from "../hooks/usePortalStore";

export function AccountPage() {
  const { customer, services, logout } = usePortalStore();

  return (
    <div>
      <PageHeader eyebrow="Hesabım" title="Müşteri bilgileriniz" />
      <div className="space-y-4 px-5 pb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <UserRound size={26} />
            </div>
            <div>
              <h2 className="font-black text-slate-950">{customer.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <Phone size={15} />
                {customer.phone}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Adresler</h2>
          <div className="mt-3 space-y-2">
            {customer.addresses.map((address) => (
              <p key={address} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <MapPin className="mt-0.5 shrink-0 text-brand-600" size={17} />
                {address}
              </p>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-black text-slate-950">Geçmiş servis kayıtları</h2>
          <div className="mt-3 space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-black text-slate-950">{service.trackingNo}</p>
                  <p className="text-xs text-slate-500">{service.brand} {service.model}</p>
                </div>
                <Badge tone="slate">{service.currentStatus}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Button variant="danger" className="w-full" onClick={logout}>
          <LogOut size={18} />
          Çıkış yap
        </Button>
      </div>
    </div>
  );
}
