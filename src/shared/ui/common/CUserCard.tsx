import { Avatar, AvatarProps } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";

interface Props {
  imgUrl?: string;
  title: string | undefined;
  subTitle?: string;
  className?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  link?: string;
  defaultImgUrl?: string;
  avatarProps?: AvatarProps;
}

export const CUserCard: FC<Props> = ({
  imgUrl,
  title,
  subTitle,
  className,
  titleClassName,
  subTitleClassName,
  link,
  avatarProps = { size: 96 },
}) => {
  const [src, setSrc] = useState(imgUrl || userDefault);
  const { t } = useTranslation();
  const handleError = () => {
    setSrc(userDefault);
  };

  return (
    <div className={cn("flex flex-row items-center gap-3", className)}>
      <Avatar
        shape="square"
        rootClassName={"[&_.ant-avatar]:!rounded-xl border-gray-800"}
        src={
          <img
            className={"h-full w-full object-cover"}
            src={src}
            alt={title || ""}
            onError={handleError}
          />
        }
        {...avatarProps}
      />

      <div>
        {title ? (
          <p className={cn("text-2xl font-bold text-black", titleClassName)}>
            {link ? <Link to={link}>{title}</Link> : title}
          </p>
        ) : (
          <p className={cn("text-2xl font-bold text-red", titleClassName)}>
            {t("common.details.doesntExist")}
          </p>
        )}
        {subTitle && (
          <span
            className={cn(
              "text-base font-medium text-gray-500",
              subTitleClassName,
            )}
          >
            {subTitle}
          </span>
        )}
      </div>
    </div>
  );
};
