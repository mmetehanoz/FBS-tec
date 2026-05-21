import { Building2, Clock3, MapPinned, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../components/ui";

const milestones = [
  ["1998", "Elazığ’da bilgisayar satış ve teknik servis hizmetleriyle faaliyet başladı."],
  ["2000’ler", "Bilgisayar bakım, yazılım kurulum ve donanım onarım süreçleri genişledi."],
  ["2010’lar", "Yazıcı, ağ, yerinde servis ve kurumsal bakım operasyonları eklendi."],
  ["Bugün", "Takip numaralı, fiyat onaylı ve müşteri panelinden izlenebilir servis deneyimi sunuluyor."],
];

const values: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Yerel Deneyim",
    text: "Elazığ’da yüz yüze destek ve hızlı ulaşılabilir servis.",
    icon: MapPinned,
  },
  {
    title: "Teknik Servis",
    text: "Arıza tespiti, bakım, onarım ve yükseltme süreçleri.",
    icon: Wrench,
  },
  {
    title: "Kurumsal Bakım",
    text: "İşletmeler için düzenli destek ve operasyon takibi.",
    icon: Building2,
  },
  {
    title: "Süreklilik",
    text: "1998’den bugüne aynı bölgede teknoloji hizmeti.",
    icon: Clock3,
  },
];

export function AboutPage() {
  return (
    <div className="px-5 pb-6 pt-6 md:px-0 md:pt-0">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg bg-brand-900 p-5 text-white shadow-soft md:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">Hakkımızda</p>
          <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
            Elazığ’da güvenilir, takip edilebilir ve ulaşılabilir teknik servis.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-200 md:text-base">
            FBS Fırat Bilgisayar Sistemleri, 1998’den beri bilgisayar, yazılım,
            yazıcı, ağ, yerinde servis ve kurumsal bakım ihtiyaçlarını tek servis
            süreci içinde karşılar.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ title, text, icon: Icon }) => (
            <Card key={title} className="p-5">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Icon size={24} />
              </div>
              <h2 className="mt-4 font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-6 md:mt-10">
        <h2 className="text-2xl font-black text-slate-950">FBS yolculuğu</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {milestones.map(([year, text]) => (
            <Card key={year} className="p-5">
              <p className="text-2xl font-black text-brand-700">{year}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
