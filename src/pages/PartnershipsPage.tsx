import { BadgeCheck, Boxes, KeyRound, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../components/ui";

const partnerships: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Donanım Ürünleri",
    text: "PC bileşenleri, notebook, çevre birimleri ve ofis ekipmanları tedariki.",
    icon: Boxes,
  },
  {
    title: "Yazılım Lisansları",
    text: "İşletim sistemi, ofis, güvenlik ve kurumsal yazılım lisans süreçleri.",
    icon: KeyRound,
  },
  {
    title: "Güvenlik Sistemleri",
    text: "Kamera, kayıt cihazı ve güvenlik altyapısı ürünleri için kurulum desteği.",
    icon: ShieldCheck,
  },
  {
    title: "Servis Ekosistemi",
    text: "Satış sonrası destek, bakım ve yedek parça süreçlerinde çözüm ortaklığı.",
    icon: BadgeCheck,
  },
];

export function PartnershipsPage() {
  return (
    <div className="px-5 pb-6 pt-6 md:px-0 md:pt-0">
      <section className="rounded-lg bg-white p-5 shadow-soft md:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Bayilikler</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">
          Donanım, yazılım ve güvenlik çözümlerinde güvenilir tedarik ağı.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          FBS; bilgisayar sistemleri, yazılım lisansları ve kamera güvenlik çözümlerinde marka
          bağımsız danışmanlıkla müşterisine doğru ürünü, doğru servis modeliyle ulaştırmayı
          hedefler.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 xl:grid-cols-4">
        {partnerships.map(({ title, text, icon: Icon }) => (
          <Card key={title} className="p-5">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <Icon size={24} />
            </div>
            <h2 className="mt-4 font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 lg:grid-cols-3">
        {["Yetkili ürün tedariği", "Kurumsal fiyatlandırma desteği", "Satış sonrası teknik destek"].map((item) => (
          <div key={item} className="rounded-lg border border-brand-100 bg-brand-50 p-5 font-black text-brand-800">
            {item}
          </div>
        ))}
      </section>
    </div>
  );
}
