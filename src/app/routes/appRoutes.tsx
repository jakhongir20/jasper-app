import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import { AppLayout } from "@/app/layouts";
import { AuthLayout, LoginPage } from "@/pages/auth/login";

import { withLazyLoad } from "@/shared/hocs";
import { AppRouteObject } from "@/shared/types";
import ProtectedPage from "@/shared/hocs/ProtectedPage";
import adminRoutes from "@/pages/admin";
import dashboardRoutes from "@/pages/dashboard";

export const settingsRoutes: AppRouteObject[] = [];

export function RouterConfig() {
  const routes: RouteObject[] = [
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "/auth/login",
          element: <LoginPage />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedPage element={<AppLayout from="main" />} />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard/bids" replace />,
        },
        {
          path: "/icons-list",
          element: withLazyLoad(() => import("@/pages/IconsList")),
        },
        // Always include dashboard routes
        ...dashboardRoutes,
        // Always include admin routes - AdminProtectedPage will handle access control
        ...adminRoutes,
        // Profile routes
        {
          path: "/profile",
          element: withLazyLoad(() => import("@/pages/profile/Page")),
        },
      ],
    },
    {
      path: "/500",
      element: withLazyLoad(() => import("@/pages/ServerError")),
    },
    {
      path: "*",
      element: withLazyLoad(() => import("@/pages/NotFound")),
    },
    {
      path: "/404",
      element: withLazyLoad(() => import("@/pages/NotFound")),
    },
  ];
  return createBrowserRouter(routes);
}
