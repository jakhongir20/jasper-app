import { RouteObject } from "react-router-dom";

import { IconType, PermissionModel } from "@/shared/types";

export type CustomChildrenRoute = RouteObject & {
  path?: string;
  meta?: {
    title: string;
    icon: IconType;
    model?: PermissionModel;
  };
};

export type AppRouteObject = RouteObject & {
  meta: {
    key: string;
    title: string;
    icon: IconType;
  };
  children?: CustomChildrenRoute[];
};

export type MenuData = {
  key: string;
  title: string;
  icon: IconType;
  path: string;
};
