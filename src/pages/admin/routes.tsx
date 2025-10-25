import { Navigate } from "react-router-dom";

import { withLazyLoad } from "@/shared/hocs";
import { AppRouteObject, IconType } from "@/shared/types";
import { AdminLayout } from "@/pages/admin/layout";
import AdminProtectedPage from "@/shared/hocs/AdminProtectedPage";

// Static mapping for module imports
const moduleImports = {
  users: {
    list: () => import("@/pages/admin/users/list/Page"),
    details: () => import("@/pages/admin/users/details/Page"),
    add: () => import("@/pages/admin/users/add/Page"),
    edit: () => import("@/pages/admin/users/edit/Page"),
  },
  products: {
    list: () => import("@/pages/admin/products/list/Page"),
    details: () => import("@/pages/admin/products/details/Page"),
    add: () => import("@/pages/admin/products/add/Page"),
    edit: () => import("@/pages/admin/products/edit/Page"),
  },
  clients: {
    list: () => import("@/pages/admin/clients/list/Page"),
    details: () => import("@/pages/admin/clients/details/Page"),
    add: () => import("@/pages/admin/clients/add/Page"),
    edit: () => import("@/pages/admin/clients/edit/Page"),
  },
  colors: {
    list: () => import("@/pages/admin/colors/list/Page"),
  },
  categories: {
    list: () => import("@/pages/admin/categories/list/Page"),
    details: () => import("@/pages/admin/categories/details/Page"),
    add: () => import("@/pages/admin/categories/add/Page"),
    edit: () => import("@/pages/admin/categories/edit/Page"),
  },
  moldings: {
    list: () => import("@/pages/admin/moldings/list/Page"),
    details: () => import("@/pages/admin/moldings/details/Page"),
    add: () => import("@/pages/admin/moldings/add/Page"),
    edit: () => import("@/pages/admin/moldings/edit/Page"),
  },
};

function createModuleRoutes(module: {
  name: keyof typeof moduleImports;
  title: string;
  icon: IconType;
}): AppRouteObject {
  const imports = moduleImports[module.name];

  // Check if this module only has a list page (like colors)
  if (Object.keys(imports).length === 1 && imports.list) {
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
      ],
    };
  }

  // Full module with all pages
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
        path: ":guid",
        element: withLazyLoad(imports.details),
      },
      {
        path: "add",
        element: withLazyLoad(imports.add),
      },
      {
        path: "edit/:guid",
        element: withLazyLoad(imports.edit),
      },
    ],
  };
}

const modules = (
  [
    { name: "users", title: "navigation.users", icon: "users" },
    { name: "clients", title: "navigation.clients", icon: "people" },
    { name: "products", title: "navigation.products", icon: "cube" },
    { name: "colors", title: "navigation.colors", icon: "badge-percent" },
    { name: "categories", title: "navigation.categories", icon: "layer-group" },
    { name: "moldings", title: "navigation.moldings", icon: "manufacture" },
  ] as { name: keyof typeof moduleImports; title: string; icon: IconType }[]
).map(createModuleRoutes);

const adminRoutes: AppRouteObject[] = [
  {
    path: "admin",
    meta: {
      key: "__admin",
      title: "Admin",
      icon: "monitor",
    },
    element: <AdminProtectedPage element={<AdminLayout />} />,
    children: [
      {
        index: true,
        element: <Navigate to="users" replace />,
      },
      ...modules,
    ],
  },
];

export default adminRoutes;
