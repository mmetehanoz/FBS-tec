import { customers } from "../../data/mockData";
import { Card } from "../../components/ui";

export function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Müşteriler</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Müşteri listesi</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-5">
            <h2 className="text-lg font-black text-slate-950">{customer.name}</h2>
            <p className="mt-2 text-sm font-semibold text-brand-700">{customer.phone}</p>
            <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{customer.addresses[0]}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
