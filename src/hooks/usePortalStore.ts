import { create } from "zustand";
import { customers, serviceRecords } from "../data/mockData";
import { serviceApi } from "../lib/api";
import type { Customer, Message, ServiceRecord } from "../types";

interface PortalState {
  customer: Customer;
  services: ServiceRecord[];
  isAuthenticated: boolean;
  serviceApiStatus: "idle" | "loading" | "ready" | "error";
  login: (customerUpdates?: Partial<Customer>) => void;
  logout: () => void;
  registerCustomer: (customer: Pick<Customer, "name" | "phone" | "email">) => void;
  loadServices: () => Promise<void>;
  createService: (service: ServiceRecord) => Promise<ServiceRecord>;
  addService: (service: ServiceRecord) => void;
  addMessage: (serviceId: string, message: Message) => void;
  updateService: (serviceId: string, updates: Partial<ServiceRecord>) => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  customer: customers[0],
  services: serviceRecords,
  isAuthenticated: false,
  serviceApiStatus: "idle",
  login: (customerUpdates) =>
    set((state) => ({
      isAuthenticated: true,
      customer: customerUpdates ? { ...state.customer, ...customerUpdates } : state.customer,
    })),
  logout: () => set({ isAuthenticated: false }),
  registerCustomer: (customer) =>
    set((state) => ({
      isAuthenticated: true,
      customer: {
        ...state.customer,
        ...customer,
        addresses: state.customer.addresses,
      },
    })),
  loadServices: async () => {
    set({ serviceApiStatus: "loading" });
    try {
      const services = await serviceApi.listServices();
      set({ services, serviceApiStatus: "ready" });
    } catch {
      set({ serviceApiStatus: "error" });
    }
  },
  createService: async (service) => {
    try {
      const createdService = await serviceApi.createService(service);
      set((state) => ({
        services: [createdService, ...state.services.filter((item) => item.id !== createdService.id)],
        serviceApiStatus: "ready",
      }));
      return createdService;
    } catch {
      set((state) => ({
        services: [service, ...state.services],
        serviceApiStatus: "error",
      }));
      return service;
    }
  },
  addService: (service) =>
    set((state) => ({ services: [service, ...state.services] })),
  addMessage: (serviceId, message) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId
          ? { ...service, messages: [...service.messages, message] }
          : service,
      ),
    })),
  updateService: (serviceId, updates) =>
    set((state) => {
      void serviceApi.updateService(serviceId, updates).catch(() => undefined);
      return {
        services: state.services.map((service) =>
          service.id === serviceId ? { ...service, ...updates } : service,
        ),
      };
    }),
}));
