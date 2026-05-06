import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  KeyRound,
  Laptop,
  MapPin,
  MonitorCog,
  Network,
  PhoneCall,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../data/mockData";
import { Card } from "../components/ui";

const highlights = [
  { value: "1998", label: "kuruluş" },
  { value: "Elazığ", label: "yerel servis ağı" },
  { value: "6+", label: "ana hizmet grubu" },
  { value: "B2C/B2B", label: "müşteri modeli" },
];

const solutionAreas = [
  {
    title: "Bilgisayar Sistemleri",
    text: "Masaüstü, notebook, oyuncu ve ofis sistemlerinde ürün seçimi, kurulum ve yükseltme.",
    icon: Cpu,
  },
  {
    title: "Güvenlik Kameraları",
    text: "Keşif, kamera seçimi, kayıt sistemi kurulumu ve bakım planlaması.",
    icon: Camera,
  },
  {
    title: "Yazılım & Lisans",
    text: "İşletim sistemi, ofis, antivirüs ve kurumsal yazılım lisans tedariği.",
    icon: KeyRound,
  },
  {
    title: "Ağ & Kurumsal Destek",
    text: "İşletmeler için ağ altyapısı, yerinde müdahale ve periyodik bakım.",
    icon: Network,
  },
];

const brands = ["Lenovo", "HP", "Dell", "Asus", "Hikvision", "Microsoft", "ESET", "Logitech"];

const productPromos = [
  {
    title: "Ofis PC Paketleri",
    text: "Muhasebe, stok, yazışma ve günlük operasyon için dengeli sistemler.",
    tag: "Satış + kurulum",
    icon: Laptop,
    tone: "bg-brand-50 text-brand-700",
  },
  {
    title: "Kamera Keşif & Kurulum",
    text: "İşyeri ve apartmanlar için kayıt cihazı dahil uçtan uca güvenlik çözümü.",
    tag: "Yerinde keşif",
    icon: Camera,
    tone: "bg-brand-100 text-brand-700",
  },
  {
    title: "Lisans & Güvenlik",
    text: "Windows, Office ve antivirüs lisanslarında doğru ürün danışmanlığı.",
    tag: "Kurumsal uygunluk",
    icon: ShieldCheck,
    tone: "bg-slate-100 text-brand-700",
  },
];

const tickerItems = [
  "PC donanım satışı",
  "Notebook yükseltme",
  "Kamera sistemi kurulumu",
  "Windows & Office lisans",
  "Antivirüs çözümleri",
  "Yerinde teknik servis",
  "Kurumsal bakım",
  "Ağ altyapısı",
];

const quickBenefits: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Stok & teklif",
    text: "Güncel ürün grupları için hızlı geri dönüş",
    icon: ShoppingBag,
  },
  {
    title: "Kurulum",
    text: "Satın aldığınız ürünü çalışır teslim edin",
    icon: Truck,
  },
  {
    title: "Hızlı servis",
    text: "Satış sonrası yerel teknik destek",
    icon: Zap,
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
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-700">
              <Sparkles size={15} />
              Elazığ’ın teknoloji çözüm ortağı
            </div>
          </div>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            <span className="block text-white">Bilgisayar, kamera ve yazılımda</span>
            <span className="mt-1 block text-brand-100">doğru ürünü hızlıca bulun.</span>
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-white/86 md:text-lg">
            1998’den beri PC donanımı, yazılım lisansları, kamera güvenlik sistemleri,
            teknik servis ve kurumsal destek ihtiyaçlarınızı tek çatı altında çözüyoruz.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 md:max-w-2xl">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-[0.98]"
              to="/iletisim"
            >
              <PhoneCall size={19} />
              Teklif ve danışmanlık alın
            </Link>
            <Link
              to="/servis-talebi"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <ClipboardCheck size={19} />
              Servis talebi oluştur
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
              <Sparkles size={15} className="text-brand-600" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 md:mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Satış vitrini
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              Bugün konuşulan ihtiyaçlar
            </h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-black text-brand-700" to="/iletisim">
            Teklif iste
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {productPromos.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <Card className="relative h-full overflow-hidden p-5">
                <div className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {promo.tag}
                </div>
                <div className={`grid h-14 w-14 place-items-center rounded-lg ${promo.tone}`}>
                  <promo.icon size={25} />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">{promo.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{promo.text}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    FBS önerisi
                  </span>
                  <ArrowRight className="text-brand-700" size={19} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Çözüm alanları
          </p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            Ev, ofis ve kurumlar için ölçülü teknoloji yatırımı.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            FBS yalnızca ürün satmaz; ihtiyacınızı analiz eder, doğru ekipmanı önerir,
            kurulumunu yapar ve sonrasında ulaşılabilir destek sağlar.
          </p>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700" to="/hakkimizda">
            Firmayı tanıyın
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {solutionAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <area.icon size={24} />
                </div>
                <h3 className="font-black text-slate-950">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-brand-900 p-5 text-white md:mt-10 md:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
              Hizmet kapsamı
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Tek seferlik satış değil, sürdürülebilir destek.
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
                  ["Talep", "09:20", "bg-brand-600"],
                  ["Keşif", "11:00", "bg-brand-500"],
                  ["Kurulum", "14:30", "bg-brand-100"],
                  ["Destek", "Aktif", "bg-brand-700"],
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
                <MonitorCog size={25} />
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">
                Kurumsal bakım ve saha servisleri
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                İşletmeler için bilgisayar, kamera, ağ ve yazılım tarafında düzenli kontrol,
                hızlı müdahale ve kayıt altına alınan servis süreçleri sağlar.
              </p>
              <div className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
                {["Yerinde servis planlama", "Fiyat onaylı işlem akışı", "Servis geçmişi ve not takibi"].map((item) => (
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
            <Award size={25} />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-950">Bayilik ve yeterlilik yaklaşımı</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Donanım, yazılım ve güvenlik ürünlerinde marka bağımsız danışmanlıkla, ihtiyaca uygun
            ve servis edilebilir çözümler önerilir.
          </p>
          <div className="mt-5 grid gap-3">
            <Link className="rounded-lg bg-slate-50 p-4 font-black text-slate-950 transition hover:bg-brand-50 hover:text-brand-700" to="/bayilikler">
              Bayilikler ve ürün grupları
            </Link>
            <Link className="rounded-lg bg-slate-50 p-4 font-black text-slate-950 transition hover:bg-brand-50 hover:text-brand-700" to="/yeterlilikler">
              Teknik yeterlilikler
            </Link>
          </div>
        </Card>
      </section>

      <section className="mt-6 md:mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Çalışılan ürün grupları
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              Tanıdık markalar, doğru konfigürasyon.
            </h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-black text-brand-700" to="/bayilikler">
            Detaylar
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
          <div className="flex w-max animate-marquee gap-3">
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="grid min-h-20 w-36 place-items-center rounded-lg bg-slate-50 px-3 text-center text-sm font-black text-slate-600 ring-1 ring-slate-100"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg bg-brand-700 text-white shadow-soft md:mt-10">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8 lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
              Projenizi konuşalım
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight">
              Bilgisayar, kamera veya kurumsal destek ihtiyacınız için FBS’den teklif alın.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">
              İhtiyacınızı yazın; ürün, kurulum ve servis tarafında uygulanabilir bir yol haritası
              çıkaralım.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:w-72 md:grid-cols-1">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
              to="/iletisim"
            >
              <MapPin size={18} />
              İletişime geç
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-900/40 px-5 py-3 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-brand-900/55"
              to="/servis-takip"
            >
              <ShieldCheck size={18} />
              Servis takip
            </Link>
          </div>
        </div>
        <div className="grid border-t border-white/15 bg-brand-900/30 text-sm font-bold text-white md:grid-cols-3">
          {["Satış danışmanlığı", "Yerinde keşif", "Servis sonrası destek"].map((item) => (
            <div key={item} className="flex min-h-14 items-center justify-center gap-2 border-white/15 px-4 md:border-r md:last:border-r-0">
              <CheckCircle2 size={17} className="text-brand-100" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
