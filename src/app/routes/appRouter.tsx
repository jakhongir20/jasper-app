import { RouterProvider } from "react-router-dom";

import { RouterConfig } from "@/app/routes";

export function AppRouter() {
  return <RouterProvider router={RouterConfig()} />;
}
