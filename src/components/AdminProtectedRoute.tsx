import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePortalStore } from "../hooks/usePortalStore";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const isAdminAuthenticated = usePortalStore((state) => state.isAdminAuthenticated);
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate replace to="/admin/giris" state={{ from: location.pathname }} />;
  }

  return children;
}
