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
  children?: React.ReactNode;
}

export const BreadcrumbWithChild: FC<Props> = ({
  className,
  breadcrumb,
  children,
}) => {
  if (!breadcrumb.length) {
    return null;
  }

  return (
    <div
      className={
        "flex flex-row flex-nowrap items-center justify-between border-b border-gray-800 bg-white py-3 pl-4 pr-5"
      }
    >
      <BreadcrumbUI
        className={cn(className, "")}
        items={breadcrumb.map((item) => ({
          title: item.link ? (
            <Link
              className="!ml-0 !flex items-center gap-1.5 rounded"
              to={item.link}
            >
              {item.icon && (
                <Icon icon={item.icon as IconType} color="text-black" />
              )}
              <span className="text-sm font-medium text-black-100">
                {item.label}
              </span>
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              {item.label}
            </span>
          ),
        }))}
      />
      {children}
    </div>
  );
};
