import { Award, ClipboardCheck, FileCheck2, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../components/ui";

const qualifications: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Teknik Servis Süreci",
    text: "Kayıt, ön inceleme, arıza tespiti, fiyat onayı, onarım ve test adımları takip edilir.",
    icon: ClipboardCheck,
  },
  {
    title: "Kurulum Yetkinliği",
    text: "Kamera sistemi, PC kurulumu, ağ ve çevre birimi yapılandırmalarında saha deneyimi.",
    icon: Award,
  },
  {
    title: "Dokümantasyon",
    text: "Servis notları, müşteri onayları ve işlem geçmişi portal üzerinden izlenebilir.",
    icon: FileCheck2,
  },
  {
    title: "Güvenilirlik",
    text: "Cihaz teslim, parça değişimi ve fiyat onayı süreçleri şeffaf şekilde yürütülür.",
    icon: Shield,
  },
];

export function QualificationsPage() {
  return (
    <div className="px-5 pb-6 pt-6 md:px-0 md:pt-0">
      <section className="rounded-lg bg-brand-900 p-5 text-white shadow-soft md:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">Yeterlilikler</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight md:text-5xl">
          Servis kalitesi, süreç takibi ve saha deneyimi bir arada.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
          FBS’nin yeterlilik yaklaşımı yalnızca teknik müdahaleye değil; kayıt, iletişim,
          fiyat onayı, test ve teslim süreçlerinin düzenli yönetilmesine dayanır.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2">
        {qualifications.map(({ title, text, icon: Icon }) => (
          <Card key={title} className="p-5 md:p-6">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <Icon size={24} />
            </div>
            <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
          </Card>
        ))}
      </section>

      <section className="mt-6 rounded-lg bg-white p-5 shadow-soft md:mt-10 md:p-7">
        <h2 className="text-2xl font-black text-slate-950">Servis standardı</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {["Kayıt", "İnceleme", "Onay", "Onarım", "Teslim"].map((step, index) => (
            <div key={step} className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-black text-white">
                {index + 1}
              </p>
              <p className="mt-3 font-black text-slate-950">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
