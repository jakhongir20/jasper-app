import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";

interface LabelProps {
  label: string;
  children?: ReactNode;
  className?: string;
}

export const Label: FC<LabelProps> = ({ label, children, className }) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className={"text-dark text-xs font-normal"}>{label}</label>
      {children}
    </div>
  );
};
