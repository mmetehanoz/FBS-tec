import type { Customer, ServiceRecord } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5174";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız oldu: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const serviceApi = {
  listCustomers: () => request<Customer[]>("/api/customers"),
  createCustomer: (customer: Customer) =>
    request<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    }),
  updateCustomer: (id: string, updates: Partial<Customer>) =>
    request<Customer>(`/api/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  listServices: () => request<ServiceRecord[]>("/api/services"),
  getService: (id: string) => request<ServiceRecord>(`/api/services/${id}`),
  createService: (service: ServiceRecord) =>
    request<ServiceRecord>("/api/services", {
      method: "POST",
      body: JSON.stringify(service),
    }),
  updateService: (id: string, updates: Partial<ServiceRecord>) =>
    request<ServiceRecord>(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
};
