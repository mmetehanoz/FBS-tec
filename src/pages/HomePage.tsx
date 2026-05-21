import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HardDrive,
  Home,
  MessageCircle,
  MonitorCog,
  Network,
  PhoneCall,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../data/mockData";
import { Card } from "../components/ui";

const highlights = [
  { value: "1998", label: "Elazığ’da servis deneyimi" },
  { value: "10", label: "adımlı takip süreci" },
  { value: "SMS", label: "müşteri bilgilendirme" },
  { value: "A-Z", label: "teslimata kadar servis" },
];

const repairAreas: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Notebook & masaüstü onarım",
    text: "Açılmama, yavaşlama, ekran, disk, RAM, anakart ve güç arızaları için ön inceleme.",
    icon: MonitorCog,
  },
  {
    title: "Yazıcı ve çevre birimi servisi",
    text: "Yazdırmama, tarama, toner, ağ bağlantısı, sürücü ve kurulum sorunları için destek.",
    icon: Printer,
  },
  {
    title: "Yazılım, format ve lisans",
    text: "Windows kurulumu, sürücü düzenleme, lisans kontrolü, antivirüs ve temel güvenlik ayarları.",
    icon: ShieldCheck,
  },
  {
    title: "Ağ ve kurumsal bakım",
    text: "Ofis bilgisayarları, modem/router, yerel ağ, yazıcı ve düzenli bakım talepleri.",
    icon: Network,
  },
];

const processSteps: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Talep oluştur",
    text: "Ürün, arıza, servis tercihi ve uygun zaman bilgilerini girin.",
    icon: ClipboardCheck,
  },
  {
    title: "Ön inceleme",
    text: "Teknik ekip talebi kontrol eder ve servis planını oluşturur.",
    icon: Search,
  },
  {
    title: "Fiyat onayı",
    text: "Ücretli işlem gerekiyorsa kalemli teklif müşteri paneline düşer.",
    icon: FileCheck2,
  },
  {
    title: "Onarım ve test",
    text: "Onay sonrası işlem yapılır, test edilir ve teslimata hazırlanır.",
    icon: Wrench,
  },
];

const tickerItems = [
  "Notebook arıza tespiti",
  "Masaüstü PC bakım",
  "SSD / RAM yükseltme",
  "Yazıcı arıza servisi",
  "Windows kurulum",
  "Ağ ve yazıcı desteği",
  "Yerinde servis",
  "Servis takip paneli",
];

const quickBenefits: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Takip numarası",
    text: "Her talep tarih bazlı FBS servis koduyla izlenir.",
    icon: FileCheck2,
  },
  {
    title: "Fiyat onayı",
    text: "Onay almadan ücretli onarım başlatılmaz.",
    icon: CheckCircle2,
  },
  {
    title: "Yerinde destek",
    text: "Uygun taleplerde adresinizde servis planlanır.",
    icon: Home,
  },
];

export function HomePage() {
  return (
    <div className="px-5 pb-6 pt-5 md:px-0 md:pb-12 md:pt-0">
      <section className="relative overflow-hidden rounded-lg bg-brand-900 text-white shadow-soft">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-x-0 top-0 h-2 bg-brand-500" />
        <div className="absolute -right-24 top-16 hidden h-72 w-72 rounded-full bg-brand-500/20 blur-3xl md:block" />
        <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(0deg,rgba(255,255,255,0.10),rgba(255,255,255,0))]" />
        <div className="relative flex flex-col justify-center p-5 md:p-10 lg:min-h-[560px] lg:p-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-700">
            <Sparkles size={15} />
            FBS Teknik Servis Merkezi
          </div>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            <span className="block text-white">Arıza tespitinden teslimata</span>
            <span className="mt-1 block text-brand-100">A’dan Z’ye teknik servis.</span>
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-white/86 md:text-lg">
            Bilgisayar, notebook, yazıcı, yazılım, ağ ve kurumsal bakım taleplerinizi
            kayıt altına alır; fiyat onayı, onarım, test ve teslim sürecini müşteri panelinden
            takip edilebilir hale getiririz.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 md:max-w-2xl">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-[0.98]"
              to="/servis-talebi"
            >
              <ClipboardCheck size={19} />
              Servis talebi oluştur
            </Link>
            <Link
              to="/servis-takip"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <Search size={19} />
              Servis durumunu takip et
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-100">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {quickBenefits.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-white/12 bg-white p-4 text-slate-900 shadow-sm">
                <Icon className="text-brand-700" size={20} />
                <p className="mt-3 text-sm font-black">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-lg border border-brand-100 bg-brand-700 py-3 text-white shadow-soft md:mt-6">
        <div className="flex w-max animate-marquee gap-3">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-brand-700 ring-1 ring-white/40"
            >
              <TimerReset size={15} className="text-brand-600" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 md:mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Servis kapsamı
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              Teknik servis ihtiyacınızı tek ekrandan başlatın.
            </h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-black text-brand-700" to="/servis-talebi">
            Talep oluştur
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {repairAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Card className="h-full p-5">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <area.icon size={25} />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">{area.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{area.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Servis akışı
          </p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            Her adım kayıtlı, onaylı ve takip edilebilir.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            FBS servis süreci; talep kaydı, ön inceleme, teknik tespit, fiyat onayı, onarım,
            test ve teslim aşamalarından oluşur. Müşteri tarafında takip numarasıyla şeffaf
            bir servis deneyimi sunulur.
          </p>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700" to="/servis-takip">
            Servis takibi aç
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600 text-white">
                  <step.icon size={22} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-600">
                  Adım {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-black text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-brand-900 p-5 text-white md:mt-10 md:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
              Hizmetler
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Servis masasından saha desteğine kadar.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-lg bg-white p-4 text-slate-900 ring-1 ring-brand-100">
                <service.icon size={22} className="text-brand-700" />
                <h3 className="mt-3 font-black">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-80 overflow-hidden bg-slate-950 p-5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="relative grid h-full content-center gap-3">
                {[
                  ["Talep", "Alındı", "bg-brand-600"],
                  ["Ön inceleme", "Sırada", "bg-brand-500"],
                  ["Fiyat onayı", "Bekler", "bg-brand-100"],
                  ["Test", "Teslim öncesi", "bg-brand-700"],
                ].map(([label, time, color], index) => (
                  <motion.div
                    key={label}
                    className="flex items-center justify-between rounded-lg bg-white/10 p-4 text-white ring-1 ring-white/12 backdrop-blur"
                    animate={{ x: index % 2 === 0 ? [0, 8, 0] : [0, -8, 0] }}
                    transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-sm ${color}`} />
                      <span className="font-black">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">{time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-5 md:p-7">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <MessageCircle size={25} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">
                Teknik ekiple iletişim aynı panelde.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Servis notları, fiyat teklifi, müşteri onayı ve mesajlaşma alanı tek müşteri
                portalında toplanır. Müşteri hangi aşamada olduğunu kolayca görür.
              </p>
              <div className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
                {["Takip numarası", "Kalemli fiyat teklifi", "Teknik servis mesajları"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-brand-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-7">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <HardDrive size={25} />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-950">Servise bırak, adresten aldır veya yerinde destek iste.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Talep formunda servis tercihinizi seçin. Uygun durumlarda yerinde servis planlanır,
            ürün adresten alınır veya müşteri ürünü doğrudan FBS servisine bırakır.
          </p>
          <div className="mt-5 grid gap-3">
            <Link className="rounded-lg bg-slate-50 p-4 font-black text-slate-950 transition hover:bg-brand-50 hover:text-brand-700" to="/servis-talebi">
              Yeni servis talebi oluştur
            </Link>
            <Link className="rounded-lg bg-slate-50 p-4 font-black text-slate-950 transition hover:bg-brand-50 hover:text-brand-700" to="/iletisim">
              Teknik servis ile iletişime geç
            </Link>
          </div>
        </Card>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg bg-brand-700 text-white shadow-soft md:mt-10">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8 lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
              Servis kaydı başlatın
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight">
              Cihazınız, yazıcınız veya ağ altyapınız için teknik servis talebi oluşturun.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">
              Talep sonrası sistem otomatik takip numarası üretir ve süreci müşteri panelinden
              takip edebilirsiniz.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:w-72 md:grid-cols-1">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
              to="/servis-talebi"
            >
              <ClipboardCheck size={18} />
              Talep oluştur
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-900/40 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-brand-900/55"
              to="/iletisim"
            >
              <PhoneCall size={18} />
              Bize ulaşın
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
