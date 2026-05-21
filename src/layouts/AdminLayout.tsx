import { useEffect } from "react";
import {
  BarChart3,
  BellRing,
  ClipboardList,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { usePortalStore } from "../hooks/usePortalStore";
import { ScrollToTop } from "../components/ScrollToTop";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: BarChart3 },
  { label: "Servis Talepleri", path: "/admin/servis-talepleri", icon: ClipboardList },
  { label: "Müşteriler", path: "/admin/musteriler", icon: Users },
  { label: "Mesajlar", path: "/admin/mesajlar", icon: MessageSquare },
  { label: "SMS Bildirimleri", path: "/admin/sms", icon: BellRing },
];

export function AdminLayout() {
  const loadServices = usePortalStore((state) => state.loadServices);
  const adminLogout = usePortalStore((state) => state.adminLogout);
  const navigate = useNavigate();

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/giris", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <ScrollToTop />
      <aside className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">FBS Admin</p>
            <h1 className="text-lg font-black text-slate-950">Servis Operasyon</h1>
          </div>
          <a className="text-sm font-bold text-brand-700 lg:mt-2 lg:block" href="/">
            Portal
          </a>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:overflow-visible">
          {adminNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-slate-600 transition",
                  isActive && "bg-brand-50 text-brand-700",
                )
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
          <button
            className="flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Çıkış
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
