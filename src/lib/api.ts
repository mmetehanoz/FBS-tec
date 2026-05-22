import type { Customer, ServiceRecord } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5174";

const TOKEN_KEY = "fbs-admin-token";

export function getAdminToken(): string | null {
  return typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function setAdminToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız oldu: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export interface AdminLoginResponse {
  token: string;
  user: { id: string; username: string; name: string };
}

export interface SmsTemplate {
  id: string;
  title: string;
  message: string;
}

export interface SmsLog {
  id: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

export const serviceApi = {
  adminLogin: (username: string, password: string) =>
    request<AdminLoginResponse>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

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

  listSmsTemplates: () => request<SmsTemplate[]>("/api/sms/templates"),
  createSmsTemplate: (template: Omit<SmsTemplate, "id">) =>
    request<SmsTemplate>("/api/sms/templates", {
      method: "POST",
      body: JSON.stringify(template),
    }),
  updateSmsTemplate: (id: string, updates: Partial<Omit<SmsTemplate, "id">>) =>
    request<SmsTemplate>(`/api/sms/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  deleteSmsTemplate: (id: string) =>
    request<void>(`/api/sms/templates/${id}`, { method: "DELETE" }),

  sendSms: (payload: { phone: string; message: string; customerId?: string; serviceRequestId?: string }) =>
    request<SmsLog>("/api/sms/send", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listSmsLogs: () => request<SmsLog[]>("/api/sms/logs"),

  otpSend: (phone: string) =>
    request<{ ok: boolean }>("/api/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  otpVerify: (phone: string, code: string) =>
    request<{ ok: boolean; services: ServiceRecord[] }>("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),
};

