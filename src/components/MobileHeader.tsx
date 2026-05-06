import { Building2, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white">
            <Building2 size={21} />
          </div>
          <div>
            <p className="text-base font-black leading-none text-slate-950">FBS</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
              Fırat Bilgisayar Sistemleri
            </p>
          </div>
        </Link>
        <Link
          to="/iletisim"
          className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700"
          aria-label="İletişim"
        >
          <PhoneCall size={19} />
        </Link>
      </div>
    </header>
  );
}
