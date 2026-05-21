import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { DesktopHeader } from "../components/DesktopHeader";
import { MobileHeader } from "../components/MobileHeader";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";

export function CustomerLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/giris";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9edff_0,#f5f8fc_36%,#ffffff_100%)] text-slate-900">
      <ScrollToTop />
      {!isLogin ? <DesktopHeader /> : null}
      {!isLogin ? <MobileHeader /> : null}
      <main className={isLogin ? "min-h-screen" : "safe-bottom mx-auto min-h-screen max-w-7xl md:px-6 md:py-8"}>
        <Outlet />
      </main>
      {!isLogin ? <SiteFooter /> : null}
      {!isLogin ? <BottomNav /> : null}
    </div>
  );
}
