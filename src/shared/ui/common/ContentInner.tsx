import { FC, ReactNode } from "react";

import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  children: ReactNode;
}

export const ContentInner: FC<Props> = ({ className, children }) => {
  return <div className={cn("w-full px-5 py-4", className)}>{children}</div>;
};
