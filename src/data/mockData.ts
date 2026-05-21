import { Cpu, Headphones, Home, MonitorCog, Printer, ShieldCheck } from "lucide-react";
import type { Customer, ServiceRecord, ServiceStatus } from "../types";

export const serviceStatuses: ServiceStatus[] = [
  "Talep Alındı",
  "Ön İnceleme Bekliyor",
  "Ürün Teslim Alındı",
  "Teknik İnceleme Başladı",
  "Arıza Tespit Edildi",
  "Fiyat Onayı Bekleniyor",
  "Onarım Başladı",
  "Test Ediliyor",
  "Teslime Hazır",
  "Teslim Edildi",
];

export const services = [
  {
    title: "Bilgisayar arıza tespiti",
    description: "Notebook ve masaüstü cihazlarda açılmama, yavaşlama ve donanım arızası kontrolü.",
    icon: Cpu,
  },
  {
    title: "Yazılım ve sistem onarımı",
    description: "Format, sürücü, lisans, antivirüs ve temel güvenlik yapılandırmaları.",
    icon: ShieldCheck,
  },
  {
    title: "Yazıcı servisi",
    description: "Yazdırmama, tarama, toner, bağlantı ve kurulum sorunları için servis desteği.",
    icon: Printer,
  },
  {
    title: "Teknik servis",
    description: "Arıza tespiti, fiyat onayı, onarım, test ve teslim süreci.",
    icon: MonitorCog,
  },
  {
    title: "Yerinde servis",
    description: "Uygun taleplerde Elazığ içinde adresinizde teknik destek.",
    icon: Home,
  },
  {
    title: "Kurumsal bakım",
    description: "İşletmeler için düzenli bilgisayar, ağ ve çevre birimi bakım planı.",
    icon: Headphones,
  },
];

export const customers: Customer[] = [];

export const serviceRecords: ServiceRecord[] = [];
