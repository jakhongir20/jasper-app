import { type FC } from "react";
import { NavLink, useMatches } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { settingsRoutes } from "@/app/routes/appRoutes";
import { cn } from "@/shared/helpers";
import {
  AppRouteObject,
  CustomChildrenRoute,
  PermissionModel,
} from "@/shared/types";
import { Icon } from "@/shared/ui";
import adminRoutes from "@/pages/admin";
import dashboardRoutes from "@/pages/dashboard";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  elementKey: string;
  from?: "settings" | "main";
}

// Todo: Improve the navigation component

export const Navigation: FC<Props> = ({ elementKey, from }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const matches = useMatches();

  let elements: CustomChildrenRoute[] | undefined;

  if (from === "settings") {
    elements = settingsRoutes.find(
      (item): item is AppRouteObject & { children: AppRouteObject[] } =>
        item.meta?.key === elementKey && !!item.children,
    )?.children;
  } else {
    // Combine dashboard and admin routes for main navigation
    const mainRoutes = [...dashboardRoutes];

    // Include admin routes if authenticated OR if currently on an admin path
    const isOnAdminPath = matches.some((match) =>
      match.pathname.startsWith("/admin"),
    );
    if (isAuthenticated || isOnAdminPath) {
      mainRoutes.push(...adminRoutes);
    }

    elements = mainRoutes.find(
      (item): item is AppRouteObject & { children: AppRouteObject[] } =>
        item.meta?.key === elementKey && !!item.children,
    )?.children;
  }

  const tabs = elements
    ?.filter((item: CustomChildrenRoute) => item.path)
    .map((item: CustomChildrenRoute) => ({
      title: t(item.meta?.title ?? ""),
      path: item.path,
      icon: item.meta?.icon,
      model: item.meta?.model as PermissionModel,
    }));

  return (
    <div className="flex h-[50px] items-center gap-2 px-4">
      {tabs?.map((item, index: number) => {
        return (
          <NavLink
            to={item.path as string}
            key={index}
            className={({ isActive }) =>
              cn(
                "hover:bg-primary-300 group relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2.5 py-1 transition after:absolute after:right-[-4px] after:h-4 after:w-[1px] after:bg-gray-800 after:content-[''] after:last:hidden hover:text-primary",
                isActive
                  ? "bg-primary-hover/20 text-primary"
                  : "text-black-100",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  icon={item.icon}
                  color={cn(
                    isActive ? "text-primary" : "text-black-100",
                    "group-hover:!text-primary",
                  )}
                  height={20}
                />
                <span className="text-sm font-medium">{item.title}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
