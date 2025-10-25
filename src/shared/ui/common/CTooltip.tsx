import { Tooltip, TooltipProps } from "antd";
import { FC } from "react";

import { cn } from "@/shared/helpers";

// interface Props extends TooltipProps["placement"] {
//   className?: string;
//   title: string;
//   children?: ReactNode;
// }

export const CTooltip: FC<TooltipProps> = ({
  className,
  title,
  children,
  ...rest
}) => {
  return (
    <Tooltip
      className={cn("relative z-50", className)}
      rootClassName="[&_.ant-tooltip-inner]:!text-center [&_.ant-tooltip-inner]:!max-w-40"
      placement={rest.placement ?? "bottom"}
      title={title}
    >
      {children}
    </Tooltip>
  );
};
