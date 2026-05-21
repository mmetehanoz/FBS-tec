import type { LucideIcon } from "lucide-react";

export type ServiceStatus =
  | "Talep Alındı"
  | "Ön İnceleme Bekliyor"
  | "Ürün Teslim Alındı"
  | "Teknik İnceleme Başladı"
  | "Arıza Tespit Edildi"
  | "Fiyat Onayı Bekleniyor"
  | "Onarım Başladı"
  | "Test Ediliyor"
  | "Teslime Hazır"
  | "Teslim Edildi";

export type Urgency = "Normal" | "Acil" | "Kritik";

export type ServicePreference =
  | "Adresten Teslim"
  | "Ürün adresten alınsın"
  | "Kendim servise bırakacağım";

export type PriceOfferStatus = "Bekliyor" | "Onaylandı" | "Reddedildi";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: string[];
}

export interface TimelineItem {
  status: ServiceStatus;
  date: string;
  note: string;
  completed: boolean;
}

export interface Message {
  id: string;
  from: "customer" | "technician";
  text: string;
  time: string;
  attachment?: string;
}

export interface ServiceRecord {
  id: string;
  trackingNo: string;
  customerId: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  productCategory: string;
  brand: string;
  model: string;
  serialNo: string;
  warranty: string;
  issueTitle: string;
  description: string;
  urgency: Urgency;
  preference: ServicePreference;
  address: string;
  appointment: string;
  currentStatus: ServiceStatus;
  lastUpdate: string;
  estimatedDelivery: string;
  technician: string;
  visibleNotes: string[];
  internalNotes: string[];
  photos: string[];
  priceOffer?: {
    title: string;
    amount: number;
    status: PriceOfferStatus;
    items?: PriceOfferItem[];
  };
  timeline: TimelineItem[];
  messages: Message[];
}

export interface PriceOfferItem {
  id: string;
  title: string;
  amount: number;
  status?: PriceOfferStatus;
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}
