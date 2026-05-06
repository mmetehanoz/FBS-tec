import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { usePortalStore } from "../hooks/usePortalStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = usePortalStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace to="/giris" state={{ from: location.pathname }} />;
  }

  return children;
}
