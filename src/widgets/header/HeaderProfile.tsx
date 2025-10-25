import { MenuProps } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { cn, rotateIcon } from "@/shared/helpers";
import { ApiService } from "@/shared/lib/services";
import { IconType } from "@/shared/types";
import { ActionModal, Dropdown, Icon } from "@/shared/ui";
import { useProfile } from "@/features/auth/login/model/auth.queries";
import { User } from "@/features/auth/login/model";

interface Props {
  className?: string;
}

interface MenuItemProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
  link: string;
  className?: string;
}

interface UserItemProps {
  data?: User;
  onClose: () => void;
}

export const MenuItem: FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  link,
  className,
}) =>
  link ? (
    <Link
      to={link}
      className={`group flex h-26px items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <Icon
        className={`transition-all duration-300 group-hover:text-primary ${className}`}
        icon={icon}
      />
      <span
        className={`text-black-100 transition-all duration-300 group-hover:text-primary ${className}`}
      >
        {label}
      </span>
    </Link>
  ) : (
    <div
      className={`group flex h-26px items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <Icon
        className={`transition-all duration-300 group-hover:text-primary ${className}`}
        icon={icon}
      />
      <span
        className={`text-black-100 transition-all duration-300 group-hover:text-primary ${className}`}
      >
        {label}
      </span>
    </div>
  );

export const UserItem: FC<UserItemProps> = ({ data, onClose }) => {
  const { t } = useTranslation();
  const userInitials = data?.name
    ? `${data?.name?.[0] ?? "?"}${data?.name?.[0] ?? "?"}`
    : "?";

  return (
    <Link
      to={`/profile`}
      className="flex flex-row items-center gap-2"
      onClick={onClose}
    >
      <div>
        <div
          style={{
            background:
              "linear-gradient(98deg, #CF8CFF -57.41%, #7D02FF 70.25%)",
          }}
          className="seze-9 flex h-full min-h-9 min-w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
        >
          {userInitials}
        </div>
      </div>

      <div className={"flex flex-col"}>
        <h2 className={"text-sm font-semibold text-black"}>{data?.name}</h2>

        <span className={"text-xs font-medium text-black-100"}>
          {t(
            `common.roles.${data?.is_admin ? "admin" : data?.is_supervisor ? "supervisor" : data?.is_factory ? "factory" : "admin"}`,
          )}
        </span>
      </div>
    </Link>
  );
};

export const HeaderProfile: FC<Props> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openUser, setOpenUser] = useState(false);

  const [showLogout, setShowLogout] = useState(false);

  const { data: user } = useProfile();

  const handleLogout = () => {
    // Clear the profile query cache before logging out
    queryClient.removeQueries({ queryKey: ["profile"] });
    ApiService.deleteCredentials();
    navigate("/auth/login", { replace: true });
  };

  const handleOpenUser = () => {
    setOpenUser(!openUser);
  };

  const handleCloseUser = () => {
    setOpenUser(false);
  };

  // Don't render if no user data
  if (!user) {
    return null;
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <UserItem data={user} onClose={handleCloseUser} />,
    },
    {
      type: "divider",
    },
    // {
    //   key: "4",
    //   label: (
    //     <MenuItem
    //       link={"/about"}
    //       icon="circle-question"
    //       label={t("common.header.help")}
    //     />
    //   ),
    // },
    {
      key: "5",
      label: (
        <MenuItem
          link={""}
          icon="door-open"
          label={t("common.header.logout")}
          onClick={() => setShowLogout(true)}
          className="group-hover:icon-red-500 group-hover:!text-red-500"
        />
      ),
    },
  ];

  return (
    <>
      <Dropdown
        rootClassName={
          "[&_.ant-dropdown-menu]:!min-w-[156px] [&_.ant-dropdown-menu]:!p-1 [&_.ant-dropdown-menu]:!mt-2 first:[&_.ant-dropdown-menu-item]:!px-3"
        }
        menu={{ items }}
        onOpenChange={handleOpenUser}
      >
        <div className="flex h-6 w-11 cursor-pointer items-center rounded-md bg-primary">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-black">
            {user?.name?.[0] || "?"}
          </div>

          <div className="mx-auto flex justify-center">
            <Icon
              icon="chevron-down"
              color="text-white"
              className={cn(rotateIcon(openUser))}
              height={12}
            />
          </div>
        </div>
      </Dropdown>

      <ActionModal
        title={t("common.global.wantLogout")}
        confirmBtnType={"danger"}
        type={"warning"}
        open={showLogout}
        confirmText={t("common.button.logout")}
        cancelText={t("common.button.undo")}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      >
        <p className="font-semibold">{t("common.global.logoutDescription")}</p>
      </ActionModal>
    </>
  );
};
