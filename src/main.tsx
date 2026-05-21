import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ServiceRequestPage } from "./pages/ServiceRequestPage";
import { ServiceTrackPage } from "./pages/ServiceTrackPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { MessagesPage } from "./pages/MessagesPage";
import { AccountPage } from "./pages/AccountPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PartnershipsPage } from "./pages/PartnershipsPage";
import { QualificationsPage } from "./pages/QualificationsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminRequestsPage } from "./pages/admin/AdminRequestsPage";
import { AdminServiceDetailPage } from "./pages/admin/AdminServiceDetailPage";
import { AdminCustomersPage } from "./pages/admin/AdminCustomersPage";
import { AdminMessagesPage } from "./pages/admin/AdminMessagesPage";
import { AdminSmsPage } from "./pages/admin/AdminSmsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "hakkimizda", element: <AboutPage /> },
        { path: "iletisim", element: <ContactPage /> },
        { path: "bayilikler", element: <PartnershipsPage /> },
        { path: "yeterlilikler", element: <QualificationsPage /> },
        { path: "giris", element: <LoginPage /> },
        { path: "servis-talebi", element: <ServiceRequestPage /> },
        {
          path: "servis-takip",
          element: (
            <ProtectedRoute>
              <ServiceTrackPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "servis/:serviceId",
          element: (
            <ProtectedRoute>
              <ServiceDetailPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "mesajlar",
          element: (
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "hesabim",
          element: (
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin/giris",
      element: <AdminLoginPage />,
    },
    {
      path: "/admin",
      element: (
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: "servis-talepleri", element: <AdminRequestsPage /> },
        { path: "servis/:serviceId", element: <AdminServiceDetailPage /> },
        { path: "musteriler", element: <AdminCustomersPage /> },
        { path: "mesajlar", element: <AdminMessagesPage /> },
        { path: "sms", element: <AdminSmsPage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
  {
    basename: routerBasename || "/",
  },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
