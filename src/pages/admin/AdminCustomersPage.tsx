import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Badge, Button, Card, Field, Input, Textarea } from "../../components/ui";
import { usePortalStore } from "../../hooks/usePortalStore";
import type { Customer } from "../../types";

type CustomerForm = Pick<Customer, "name" | "phone" | "email"> & {
  addressesText: string;
};

export function AdminCustomersPage() {
  const customers = usePortalStore((state) => state.customers);
  const services = usePortalStore((state) => state.services);
  const loadCustomers = usePortalStore((state) => state.loadCustomers);
  const loadServices = usePortalStore((state) => state.loadServices);
  const updateCustomer = usePortalStore((state) => state.updateCustomer);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0];
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    phone: "",
    email: "",
    addressesText: "",
  });

  useEffect(() => {
    void loadCustomers();
    void loadServices();
  }, [loadCustomers, loadServices]);

  useEffect(() => {
    if (!selectedCustomerId && customers[0]) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomer) {
      return;
    }

    setForm({
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      addressesText: selectedCustomer.addresses.join("\n"),
    });
  }, [selectedCustomer]);

  const customerServices = useMemo(
    () => services.filter((service) => service.customerId === selectedCustomer?.id),
    [selectedCustomer?.id, services],
  );

  const saveCustomer = async () => {
    if (!selectedCustomer) {
      return;
    }

    await updateCustomer(selectedCustomer.id, {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      addresses: form.addressesText
        .split("\n")
        .map((address) => address.trim())
        .filter(Boolean),
    });
    await loadServices();
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Müşteriler</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Müşteri yönetimi</h1>
        <p className="mt-2 text-slate-600">
          Müşteri iç bilgilerini görüntüleyin, düzenleyin ve bağlı servis kayıtlarını takip edin.
        </p>
      </header>

      {!customers.length ? (
        <Card className="p-5 text-sm leading-6 text-slate-600">
          Henüz müşteri kaydı yok. Yeni servis talebi açıldığında müşteri otomatik oluşacak.
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {customers.map((customer) => (
              <button
                key={customer.id}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedCustomer?.id === customer.id
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-200 bg-white hover:border-brand-200"
                }`}
                onClick={() => setSelectedCustomerId(customer.id)}
                type="button"
              >
                <h2 className="font-black text-slate-950">{customer.name || "İsimsiz müşteri"}</h2>
                <p className="mt-1 text-sm font-semibold text-brand-700">{customer.phone}</p>
                <p className="mt-1 text-xs text-slate-500">{customer.email || "E-posta belirtilmedi"}</p>
              </button>
            ))}
          </div>

          {selectedCustomer ? (
            <div className="space-y-6">
              <Card className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Müşteri iç bilgileri</h2>
                    <p className="mt-1 text-sm text-slate-500">ID: {selectedCustomer.id}</p>
                  </div>
                  <Badge tone="blue">{customerServices.length} servis</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Ad soyad">
                    <Input
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    />
                  </Field>
                  <Field label="Telefon">
                    <Input
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    />
                  </Field>
                  <Field label="E-posta">
                    <Input
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </Field>
                </div>

                <Field label="Adresler">
                  <Textarea
                    placeholder="Her satıra bir adres yazın"
                    value={form.addressesText}
                    onChange={(event) => setForm((current) => ({ ...current, addressesText: event.target.value }))}
                  />
                </Field>

                <Button type="button" onClick={saveCustomer}>
                  <Save size={18} />
                  Müşteri bilgilerini kaydet
                </Button>
              </Card>

              <Card className="space-y-3 p-5">
                <h2 className="text-xl font-black text-slate-950">Bağlı servis kayıtları</h2>
                {customerServices.length ? customerServices.map((service) => (
                  <div key={service.id} className="rounded-lg bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-brand-700">{service.trackingNo}</p>
                        <p className="mt-1 font-bold text-slate-950">{service.productCategory}</p>
                        <p className="mt-1 text-sm text-slate-500">{service.issueTitle}</p>
                      </div>
                      <Badge tone="amber">{service.currentStatus}</Badge>
                    </div>
                  </div>
                )) : (
                  <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    Bu müşteriye bağlı servis kaydı yok.
                  </p>
                )}
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
