import { Menu, PhoneCall, ShieldCheck } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { cn } from "../utils/cn";

const navItems = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Servis Süreci", path: "/yeterlilikler" },
  { label: "Servis Talep", path: "/servis-talebi" },
  { label: "Servis Takip", path: "/servis-takip" },
];

export function DesktopHeader() {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-slate-200 bg-white/92 shadow-sm backdrop-blur md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/FBS-TEK-LOGO.png"
            alt="FBS Fırat Bilgisayar Sistemleri"
            className="h-12 w-auto object-contain"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              Fırat Bilgisayar Sistemleri
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-brand-700",
                  isActive && "bg-brand-50 text-brand-700",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/giris"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
          >
            <ShieldCheck size={18} />
            Müşteri Girişi
          </Link>
          <Link
            to="/iletisim"
            className="hidden min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700 xl:inline-flex"
          >
            <PhoneCall size={18} />
            Bize Ulaşın
          </Link>
          <button
            className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-700 lg:hidden"
            aria-label="Menü"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
