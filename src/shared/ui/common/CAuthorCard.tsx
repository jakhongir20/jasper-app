import { Avatar } from "antd";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

import userDefault from "@/shared/assets/icons/userDefault.svg";
import { cn } from "@/shared/helpers";

interface Props {
  imgUrl?: string;
  title?: string;
  subTitle?: string;
  className?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  link?: string;
  defaultImgUrl?: string;
  noImg?: boolean;
}

export const CAuthorCard: FC<Props> = ({
  imgUrl,
  title,
  subTitle,
  className,
  titleClassName,
  subTitleClassName,
  link,
  noImg = false,
}) => {
  const [src, setSrc] = useState(imgUrl || userDefault);

  const handleError = () => {
    setSrc(userDefault);
  };

  if (
    !title ||
    title === "undefined" ||
    title === "null" ||
    title === "undefined undefined"
  ) {
    return "-";
  }

  return (
    <div className={cn("flex flex-row items-center gap-1", className)}>
      {!noImg && (
        <Avatar
          shape="square"
          className={"min-w- min-w-6 border-gray-800"}
          size={24}
          src={
            <img
              className={"h-full w-full object-cover"}
              src={src}
              alt={title || ""}
              onError={handleError}
            />
          }
        />
      )}
      <div>
        <p
          className={cn(
            "line-clamp-2 text-sm font-medium text-black",
            titleClassName,
          )}
        >
          {link ? (
            <Link className={"hover:!text-violet"} to={link}>
              {title}
            </Link>
          ) : (
            title
          )}
        </p>
        {subTitle && (
          <p
            className={cn(
              "text-xs font-medium text-gray-500",
              subTitleClassName,
            )}
          >
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
};
