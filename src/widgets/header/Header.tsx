import { Layout } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/shared/helpers";
import { HeaderLanguage } from "@/widgets/header/HeaderLanguage";
import { HeaderProfile } from "@/widgets/header/HeaderProfile";
import { useProfile } from "@/features/auth/login/model/auth.queries";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  className?: string;
}

export const Header: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: user } = useProfile();

  // Determine current page type for toggle link
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnAdmin = location.pathname.startsWith("/admin");

  return (
    <Layout.Header
      className={cn(
        "h-10 sm:h-10",
        "leading-10",
        "bg-gradient-to-r from-[#2EADBD] to-[#1d7488]",
        "px-3 sm:px-4 md:px-4",
        "py-2 sm:py-2",
        "text-white",
        className,
      )}
    >
      <div className="flex h-full w-full justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex flex-row items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity duration-200">
            <img
              src="/logo.svg"
              className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6"
              alt={t("common.alt.dmsLogo")}
            />
            <p className={"hidden text-xs xs:block sm:text-sm !text-white"}>
              {t("common.appInfo.version")}
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Toggle Link - Show Admin when on dashboard, Dashboard when on admin */}
          {isOnDashboard && isAuthenticated && user?.is_admin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:text-white xs:flex sm:text-sm"
            >
              <span>{t("common.header.admin")}</span>
            </Link>
          )}

          {isOnAdmin && (
            <Link
              to="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/20 hover:text-white xs:flex sm:text-sm"
            >
              <span>{t("common.header.dashboard")}</span>
            </Link>
          )}

          <HeaderLanguage />
          {isAuthenticated && <HeaderProfile />}
        </div>
      </div>
    </Layout.Header>
  );
};
