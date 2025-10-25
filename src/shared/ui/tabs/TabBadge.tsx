import React, { FC } from "react";

import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  count: number | string;
}

export const TabBadge: FC<Props> = ({ className, count = 0 }) => {
  return (
    <div
      className={cn(
        "flex h-4 w-max items-center rounded bg-gray-800 px-[3px] py-[2px] text-xs",
        className,
      )}
    >
      {count}
    </div>
  );
};
