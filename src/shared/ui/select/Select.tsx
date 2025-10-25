import { Select as AntDSelect, SelectProps as AntDSelectProps } from "antd";
import { CSSProperties, FC, useState } from "react";
import { Icon } from "@/shared/ui";
import { cn, rotateIcon } from "@/shared/helpers";
import { useSearchParams } from "react-router-dom";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<AntDSelectProps, "options" | "onChange" | "size"> {
  options?: Option[];
  onChange?: (value: string | number) => void;
  style?: CSSProperties; // Extend to allow style as a prop
  size?: "medium" | "small"; // Add size prop
  className?: string;
  queryKey?: string;
}

export const Select: FC<SelectProps> = function ({
  defaultValue,
  style,
  className,
  size = "medium", // Default size to "medium"
  queryKey = "",
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sizeClass = size === "small" ? "min-h-8" : "min-h-10";
  const [, setSearchParams] = useSearchParams();

  return (
    <AntDSelect
      allowClear
      showSearch
      rootClassName={`[&_.ant-select-item-option-selected]:!font-normal [&.ant-select:not(.ant-select-status-error)_.ant-select-selector]:!bg-gray-600 
         [&.ant-select-status-error_.ant-select-selector]:!bg-red-400`}
      className={cn(
        `min-w-[178px] [&_.ant-select-selection-placeholder]:font-medium ${sizeClass} [&_.ant-select-selection-wrap]:!min-h-9`,
        className,
      )}
      variant="filled"
      defaultValue={defaultValue}
      style={{
        ...style,
        height: size === "small" ? "32px" : "40px",
        width: className?.includes("w-full") ? "100%" : style?.width,
      }}
      suffixIcon={<Icon icon={"chevron-down"} color={rotateIcon(isOpen)} />}
      onOpenChange={(open) => setIsOpen(open)}
      onClear={() => {
        if (queryKey) {
          setSearchParams((prev) => {
            prev.delete(queryKey);
            return prev;
          });
        }
      }}
      {...rest}
    />
  );
};
