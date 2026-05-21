import { Home, MessageCircle, PhoneCall, PlusCircle, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";
import type { NavItem } from "../types";

const navItems: NavItem[] = [
  { label: "Ana", path: "/", icon: Home },
  { label: "Talep", path: "/servis-talebi", icon: PlusCircle },
  { label: "Takip", path: "/servis-takip", icon: Search },
  { label: "Mesaj", path: "/mesajlar", icon: MessageCircle },
  { label: "Ulaşın", path: "/iletisim", icon: PhoneCall },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-12px_30px_rgba(15,76,129,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold text-slate-500 transition",
                isActive && "bg-brand-50 text-brand-700",
              )
            }
          >
            <item.icon size={22} strokeWidth={2.3} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
