import React, { Suspense } from "react";
import { cn } from "@/shared/helpers";
import { LAZY_ICONS } from "@/shared/ui/icon/iconElements";
import { IconType } from "@/shared/types";

export interface IconProps {
  icon?: IconType;
  size?: string | number;
  height?: string | number;
  width?: string | number;
  color?: string;
  className?: string;
  children?: React.ReactNode;

  [key: string]: any;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 20,
  height = "100%",
  width = 20,
  color = "text-gray-500",
  className,
  children,
  ...rest
}) => {
  if (children) {
    return (
      <i
        className={cn("base-icon", color, "block")}
        style={{ fontSize: size }}
        {...rest}
      >
        {children}
      </i>
    );
  }

  if (!icon) return null;

  const IconComponent = LAZY_ICONS(height, width)[
    icon as keyof typeof LAZY_ICONS
  ];

  return (
    <i
      className={cn("base-icon", color, className)}
      style={{ fontSize: size }}
      {...rest}
    >
      <Suspense fallback={null}>{IconComponent}</Suspense>
    </i>
  );
};
