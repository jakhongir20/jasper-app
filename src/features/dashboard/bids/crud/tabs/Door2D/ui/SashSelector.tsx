import { FC } from "react";
import { Radio } from "antd";
import { cn } from "@/shared/helpers";
import { SASH_OPTIONS } from "../data/sashOptions";

interface SashSelectorProps {
  /** Currently selected sash value */
  value?: string | null;
  /** Selection change handler */
  onChange?: (value: string) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Sash selector component - radio group for selecting door sash type
 */
export const SashSelector: FC<SashSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Radio.Group
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex flex-col gap-1"
      >
        {SASH_OPTIONS.map((option) => (
          <Radio key={option.value} value={option.value} className="text-sm">
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default SashSelector;
