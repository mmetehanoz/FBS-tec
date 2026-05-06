import {
  Camera,
  Cpu,
  Headphones,
  Home,
  MonitorCog,
  ShieldCheck,
} from "lucide-react";
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
    title: "PC donanım satışı",
    description: "Oyuncu, ofis ve kurumsal sistemler için doğru parça seçimi.",
    icon: Cpu,
  },
  {
    title: "Yazılım satışları",
    description: "Lisans, güvenlik ve işletim sistemi çözümleri.",
    icon: ShieldCheck,
  },
  {
    title: "Kamera sistemleri",
    description: "Keşif, kurulum ve bakım dahil güvenlik sistemleri.",
    icon: Camera,
  },
  {
    title: "Teknik servis",
    description: "Arıza tespiti, bakım, yükseltme ve onarım süreçleri.",
    icon: MonitorCog,
  },
  {
    title: "Yerinde servis",
    description: "Elazığ içinde adresinizde hızlı teknik destek.",
    icon: Home,
  },
  {
    title: "Kurumsal destek",
    description: "İşletmeler için düzenli bakım ve öncelikli destek.",
    icon: Headphones,
  },
];

export const customers: Customer[] = [
  {
    id: "cus-1",
    name: "Ahmet Kaya",
    phone: "+90 532 111 23 23",
    email: "ahmet.kaya@example.com",
    addresses: [
      "Cumhuriyet Mah. Malatya Cad. No: 42 Elazığ",
      "Üniversite Mah. Teknokent Sitesi B Blok Elazığ",
    ],
  },
  {
    id: "cus-2",
    name: "Fırat Koleji",
    phone: "+90 424 222 44 55",
    email: "bilgi@firatkoleji.test",
    addresses: ["Ataşehir Mah. Eğitim Sok. No: 8 Elazığ"],
  },
];

export const serviceRecords: ServiceRecord[] = [
  {
    id: "svc-1",
    trackingNo: "FBS-2026-05-02-001",
    customerId: "cus-1",
    productCategory: "Notebook",
    brand: "Lenovo",
    model: "ThinkPad E15",
    serialNo: "LNV-E15-8X21",
    warranty: "Garanti dışı",
    issueTitle: "Açılışta siyah ekran",
    description:
      "Cihaz güç alıyor ancak ekrana görüntü gelmiyor. Harici monitörde de görüntü yok.",
    urgency: "Acil",
    preference: "Ürün adresten alınsın",
    address: "Cumhuriyet Mah. Malatya Cad. No: 42 Elazığ",
    appointment: "06 Mayıs 2026, 10:30",
    currentStatus: "Fiyat Onayı Bekleniyor",
    lastUpdate: "03 Mayıs 2026, 14:20",
    estimatedDelivery: "07 Mayıs 2026",
    technician: "Murat Demir",
    visibleNotes: [
      "Anakart güç hattında kısa devre tespit edildi.",
      "Parça değişimi için fiyat onayı bekleniyor.",
    ],
    internalNotes: ["BIOS hattı da test edilecek.", "Müşteri aciliyet belirtti."],
    photos: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=600&q=80",
    ],
    priceOffer: {
      title: "Anakart güç devresi onarımı",
      amount: 2450,
      status: "Bekliyor",
    },
    timeline: [
      {
        status: "Talep Alındı",
        date: "02 Mayıs 2026, 09:12",
        note: "Servis talebi müşteri portalından oluşturuldu.",
        completed: true,
      },
      {
        status: "Ön İnceleme Bekliyor",
        date: "02 Mayıs 2026, 10:05",
        note: "Teknisyen ön kontrol kuyruğuna alındı.",
        completed: true,
      },
      {
        status: "Ürün Teslim Alındı",
        date: "02 Mayıs 2026, 16:40",
        note: "Cihaz adresten teslim alındı.",
        completed: true,
      },
      {
        status: "Teknik İnceleme Başladı",
        date: "03 Mayıs 2026, 11:15",
        note: "Detaylı arıza tespiti başladı.",
        completed: true,
      },
      {
        status: "Arıza Tespit Edildi",
        date: "03 Mayıs 2026, 14:20",
        note: "Güç devresi arızası doğrulandı.",
        completed: true,
      },
      {
        status: "Fiyat Onayı Bekleniyor",
        date: "03 Mayıs 2026, 14:35",
        note: "Teklif müşteriye iletildi.",
        completed: false,
      },
    ],
    messages: [
      {
        id: "msg-1",
        from: "technician",
        text: "Merhaba Ahmet Bey, cihazınızda güç hattı arızası tespit ettik.",
        time: "14:24",
      },
      {
        id: "msg-2",
        from: "customer",
        text: "Teşekkürler, fiyat teklifini görüntüledim. Bugün dönüş yapacağım.",
        time: "14:31",
      },
    ],
  },
  {
    id: "svc-2",
    trackingNo: "FBS-2026-05-02-002",
    customerId: "cus-1",
    productCategory: "Kamera sistemi",
    brand: "Hikvision",
    model: "DS-2CD",
    serialNo: "HKV-4529",
    warranty: "Garanti kapsamında",
    issueTitle: "Gece görüşünde görüntü kaybı",
    description: "İki kamerada gece modu devreye girince görüntü kararıyor.",
    urgency: "Normal",
    preference: "Mümkünse Yerinde Servis İstiyorum",
    address: "Üniversite Mah. Teknokent Sitesi B Blok Elazığ",
    appointment: "05 Mayıs 2026, 15:00",
    currentStatus: "Teknik İnceleme Başladı",
    lastUpdate: "03 Mayıs 2026, 09:45",
    estimatedDelivery: "05 Mayıs 2026",
    technician: "Elif Yılmaz",
    visibleNotes: ["Yerinde servis randevusu planlandı."],
    internalNotes: ["IR adaptör kontrol edilecek."],
    photos: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    ],
    timeline: [
      {
        status: "Talep Alındı",
        date: "02 Mayıs 2026, 18:30",
        note: "Kamera sistemi için yerinde servis talebi alındı.",
        completed: true,
      },
      {
        status: "Ön İnceleme Bekliyor",
        date: "03 Mayıs 2026, 09:10",
        note: "Servis ekibi keşif planına ekledi.",
        completed: true,
      },
      {
        status: "Teknik İnceleme Başladı",
        date: "03 Mayıs 2026, 09:45",
        note: "Uzaktan kayıt cihazı kontrolü başladı.",
        completed: false,
      },
    ],
    messages: [
      {
        id: "msg-3",
        from: "technician",
        text: "Randevunuzu 05 Mayıs 15:00 için planladık.",
        time: "09:47",
      },
    ],
  },
];
