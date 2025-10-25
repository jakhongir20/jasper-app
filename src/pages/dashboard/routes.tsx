import { Navigate } from "react-router-dom";

import { withLazyLoad } from "@/shared/hocs";
import { AppRouteObject, IconType } from "@/shared/types";
import { DashboardLayout } from "@/pages/dashboard/layout";

// Static mapping for module imports
const moduleImports = {
  bids: {
    list: () => import("@/pages/dashboard/bids/list/Page"),
    details: () => import("@/pages/dashboard/bids/details"),
    add: () => import("@/pages/dashboard/bids/add/Page"),
    edit: () => import("@/pages/dashboard/bids/edit/Page"),
  },
  proposals: {
    list: () => import("@/pages/dashboard/proposals/list/Page"),
    details: () => import("@/pages/dashboard/proposals/details/Page"),
    add: () => import("@/pages/dashboard/proposals/add/Page"),
    edit: () => import("@/pages/dashboard/proposals/edit/Page"),
  },
  calculator: {
    list: () => import("@/pages/dashboard/calculator/list/Page"),
    details: () => import("@/pages/dashboard/calculator/details/Page"),
    add: () => import("@/pages/dashboard/calculator/add/Page"),
    edit: () => import("@/pages/dashboard/calculator/edit/Page"),
  },
  design: {
    list: () => import("@/pages/dashboard/design/list/Page"),
    details: () => import("@/pages/dashboard/design/details/Page"),
    add: () => import("@/pages/dashboard/design/add/Page"),
    edit: () => import("@/pages/dashboard/design/edit/Page"),
  },
};

function createModuleRoutes(module: {
  name: keyof typeof moduleImports;
  title: string;
  icon: IconType;
}): AppRouteObject {
  const imports = moduleImports[module.name];
  return {
    path: module.name,
    meta: {
      key: "module-" + module.name,
      title: module.title,
      icon: module.icon,
    },
    children: [
      {
        path: "",
        handle: { navigation: true },
        element: withLazyLoad(imports.list),
      },
      {
        path: ":id",
        element: withLazyLoad(imports.details),
      },
      {
        path: "add",
        element: withLazyLoad(imports.add),
      },
      {
        path: "edit/:id",
        element: withLazyLoad(imports.edit),
      },
    ],
  };
}

const modules = (
  [{ name: "bids", title: "navigation.bids", icon: "file" }] as {
    name: keyof typeof moduleImports;
    title: string;
    icon: IconType;
  }[]
).map(createModuleRoutes);

// {name: "proposals", title: "navigation.proposals", icon: "file"},
// {name: "calculator", title: "navigation.calculator", icon: "calculator"},
// {name: "design", title: "navigation.design", icon: "layout"},

const dashboardRoutes: AppRouteObject[] = [
  {
    path: "dashboard",
    meta: {
      key: "__dashboard",
      title: "common.header.dashboard",
      icon: "home",
    },
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="bids" replace />,
      },
      ...modules,
    ],
  },
];

export default dashboardRoutes;
