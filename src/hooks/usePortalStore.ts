import { create } from "zustand";
import { customers, serviceRecords } from "../data/mockData";
import { serviceApi, setAdminToken, clearAdminToken, getAdminToken } from "../lib/api";
import type { Customer, Message, ServiceRecord } from "../types";

const isAdminSessionActive = () =>
  typeof window !== "undefined" && getAdminToken() !== null;

const defaultCustomer: Customer = {
  id: "guest",
  name: "",
  phone: "",
  email: "",
  addresses: [],
};

interface PortalState {
  customer: Customer;
  customers: Customer[];
  services: ServiceRecord[];
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  serviceApiStatus: "idle" | "loading" | "ready" | "error";
  login: (customerUpdates?: Partial<Customer>) => void;
  logout: () => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  registerCustomer: (customer: Pick<Customer, "name" | "phone" | "email">) => void;
  loadCustomers: () => Promise<void>;
  createCustomer: (customer: Customer) => Promise<Customer>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<Customer | undefined>;
  loadServices: () => Promise<void>;
  createService: (service: ServiceRecord) => Promise<ServiceRecord>;
  addService: (service: ServiceRecord) => void;
  addMessage: (serviceId: string, message: Message) => void;
  updateService: (serviceId: string, updates: Partial<ServiceRecord>) => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  customer: customers[0] ?? defaultCustomer,
  customers,
  services: serviceRecords,
  isAuthenticated: false,
  isAdminAuthenticated: isAdminSessionActive(),
  serviceApiStatus: "idle",
  login: (customerUpdates) =>
    set((state) => ({
      isAuthenticated: true,
      customer: customerUpdates ? { ...state.customer, ...customerUpdates } : state.customer,
    })),
  logout: () => set({ isAuthenticated: false }),
  adminLogin: async (username, password) => {
    try {
      const { token } = await serviceApi.adminLogin(username, password);
      setAdminToken(token);
      set({ isAdminAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
  adminLogout: () => {
    clearAdminToken();
    set({ isAdminAuthenticated: false });
  },
  registerCustomer: (customer) =>
    set((state) => ({
      isAuthenticated: true,
      customer: {
        ...state.customer,
        ...customer,
        addresses: state.customer.addresses,
      },
    })),
  loadCustomers: async () => {
    try {
      const customers = await serviceApi.listCustomers();
      set({ customers });
    } catch {
      set((state) => ({
        customers: state.services.map((service) => ({
          id: service.customerId,
          name: service.contactName ?? "Müşteri",
          phone: service.contactPhone ?? "",
          email: service.contactEmail === "Belirtilmedi" ? "" : service.contactEmail ?? "",
          addresses: service.address ? [service.address] : [],
        })),
      }));
    }
  },
  createCustomer: async (customer) => {
    try {
      const createdCustomer = await serviceApi.createCustomer(customer);
      set((state) => ({
        customers: [
          createdCustomer,
          ...state.customers.filter((item) => item.id !== createdCustomer.id),
        ],
        customer: createdCustomer,
        isAuthenticated: true,
      }));
      return createdCustomer;
    } catch {
      set((state) => ({
        customers: [
          customer,
          ...state.customers.filter((item) => item.id !== customer.id),
        ],
        customer,
        isAuthenticated: true,
      }));
      return customer;
    }
  },
  updateCustomer: async (customerId, updates) => {
    try {
      const updatedCustomer = await serviceApi.updateCustomer(customerId, updates);
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId ? updatedCustomer : customer,
        ),
        customer: state.customer.id === customerId ? updatedCustomer : state.customer,
      }));
      return updatedCustomer;
    } catch {
      let nextCustomer: Customer | undefined;
      set((state) => {
        const customers = state.customers.map((customer) => {
          if (customer.id !== customerId) {
            return customer;
          }

          nextCustomer = { ...customer, ...updates };
          return nextCustomer;
        });

        return {
          customers,
          customer: state.customer.id === customerId && nextCustomer ? nextCustomer : state.customer,
        };
      });
      return nextCustomer;
    }
  },
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
    set((state) => {
      const service = state.services.find((item) => item.id === serviceId);
      const messages = service ? [...service.messages, message] : [message];
      void serviceApi.updateService(serviceId, { messages }).catch(() => undefined);

      return {
        services: state.services.map((item) =>
          item.id === serviceId ? { ...item, messages } : item,
        ),
      };
    }),
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
