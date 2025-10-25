import { FC } from "react";
import { cn } from "@/shared/helpers";
import { Breadcrumb as BreadcrumbUI } from "antd";
import { Icon } from "@/shared/ui";
import { Link } from "react-router-dom";
import { IconType } from "@/shared/types";

interface Props {
  className?: string;
  breadcrumb: Array<{
    label: string;
    icon?: string;
    link?: string;
  }>;
}

export const Breadcrumb: FC<Props> = ({ className, breadcrumb }) => {
  if (!breadcrumb.length) {
    return null;
  }

  return (
    <div>
      <BreadcrumbUI
        className={cn(className, "flex h-[50px] items-center px-4")}
        items={breadcrumb.map((item) => ({
          title: item.link ? (
            <Link
              className="!ml-0 !flex items-center gap-1.5 rounded"
              to={item?.link}
            >
              {item.icon && (
                <Icon icon={item?.icon as IconType} color="text-black" />
              )}
              <span className="text-sm font-medium text-black-100">
                {item?.label}
              </span>
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              {item?.label}
            </span>
          ),
        }))}
      />
    </div>
  );
};
