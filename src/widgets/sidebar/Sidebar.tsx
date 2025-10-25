import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { settingsRoutes } from "@/app/routes/appRoutes";
import { cn } from "@/shared/helpers";
import { AppRouteObject, MenuData } from "@/shared/types";
import { Button, CTooltip, Icon } from "@/shared/ui";
import adminRoutes from "@/pages/admin";
import dashboardRoutes from "@/pages/dashboard";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  className?: string;
  from?: "settings" | "main";
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

function generateSidebarRoutes(routes: AppRouteObject[]): MenuData[] {
  const sidebarRoutes: MenuData[] = [];

  routes.forEach((route: AppRouteObject) => {
    if (route.meta) {
      sidebarRoutes.push({
        key: route.meta.key,
        title: route.meta.title,
        icon: route.meta.icon,
        path: route.path as string,
      });
    }
  });

  return sidebarRoutes;
}

export const Sidebar: FC<Props> = ({
  className,
  from,
  collapsed,
  setCollapsed,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  let sidebarRoutes: MenuData[] = [];

  switch (from) {
    case "settings":
      sidebarRoutes = generateSidebarRoutes(settingsRoutes);
      break;
    default:
      // Combine dashboard and admin routes for main navigation
      const mainRoutes = [...dashboardRoutes];

      // Include admin routes if authenticated OR if currently on an admin path
      const isOnAdminPath = location.pathname.startsWith("/admin");
      if (isAuthenticated || isOnAdminPath) {
        mainRoutes.push(...adminRoutes);
      }

      sidebarRoutes = generateSidebarRoutes(mainRoutes);
      break;
  }
  const navigate = useNavigate();

  const handleCollapsed = (e) => {
    e.stopPropagation();
    setCollapsed((prev) => !prev);
    localStorage.setItem("collapsed", JSON.stringify(collapsed));
  };

  const isActive = (item: MenuData) =>
    useMemo(() => {
      return location.pathname.split("/")[1].includes(item.path);
    }, [location.pathname, item.path]);

  return (
    <div
      className={cn(
        className,
        "flex flex-col border-r border-gray-700 bg-gray-600 text-gray-100",
      )}
    >
      {from === "settings" ? (
        <div className="flex h-[50px] items-center gap-2 border-b border-gray-800 px-4">
          <Button
            type="default"
            color={"default"}
            className="!h-7 !w-7 !rounded-[5px]"
            onClick={() => navigate("/crm/organizations")}
            icon={<Icon icon="chevron-down" className="rotate-90" />}
          />
          <span className="text-sm font-medium text-black">
            {t("common.button.back")}
          </span>
        </div>
      ) : (
        <div className="flex h-[51px] cursor-pointer items-center border-b border-gray-800 p-2">
          <div
            onClick={() => {
              navigate("/home");
            }}
            className={cn(
              "relative flex w-full items-center rounded-lg py-1.5 transition duration-200",
              collapsed ? "gap-2 px-2" : "px-1",
            )}
          >
            {/*{collapsed && (*/}
            {/*  <span className="truncate font-semibold text-black">hELLOW</span>*/}
            {/*)}*/}
            <div
              onClick={handleCollapsed}
              className={
                "hover:bg-gray-500] absolute -right-[18px] top-2 z-20 flex h-5 w-5 items-center justify-center rounded border border-gray-800 bg-gray-600 transition"
              }
            >
              <Icon
                width={16}
                icon={"arrow-double-left"}
                className={cn(
                  "transition duration-200 hover:text-primary",
                  collapsed ? "" : "rotate-180",
                )}
              />
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-0.5 p-2">
        {sidebarRoutes.map((item: MenuData) => {
          if (item.key === "__dev") return null;

          return (
            <li key={item.key} className={collapsed ? "min-w-40" : ""}>
              <CTooltip
                title={collapsed ? "" : t(item.title)}
                placement={"right"}
                className={cn(
                  isActive(item) ? "bg-[#E6DBF6]" : "",
                  "group flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-black-100 transition hover:bg-[#E6DBF6] hover:text-primary",
                )}
              >
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        icon={item.icon}
                        color={cn(
                          isActive ? "text-primary" : "text-gray-500",
                          "group-hover:!text-primary",
                        )}
                      />
                      {collapsed && (
                        <span
                          className={cn(
                            isActive ? "text-primary" : "text-black-100",
                            "group-hover:!text-primary",
                          )}
                        >
                          {t(item.title)}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </CTooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
