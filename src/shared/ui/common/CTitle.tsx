import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";

interface Props {
  className?: string;
  value: ReactNode;
}

export const CTitle: FC<Props> = ({ className, value }) => {
  return (
    <h1
      className={cn("text-lg font-semibold text-black lg:text-2xl", className)}
    >
      {value}
    </h1>
  );
};
