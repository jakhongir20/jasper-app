import React from "react";
import { InputProps } from "antd/lib/input";
import { Icon } from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/helpers";

interface Props extends InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  rootClassName?: string;
}

export const SearchInput: React.FC<Props> = ({
  value,
  className,
  onChange,
  rootClassName,
  ...rest
}) => {
  return (
    <Input
      rootClassName={cn(
        "min-w-[200px] !max-h-8 !h-8 w-[200px] rounded-lg bg-gray-600 focus:!bg-gray-600 hover:bg-gray-600 p-1.5 [&>input]:placeholder:!text-gray-500 text-xs text-black font-medium border-gray-800",
        rootClassName,
      )}
      className={cn("h-8 !max-h-8 !text-sm", className)}
      allowClear
      suffix={undefined}
      value={value}
      onChange={onChange}
      prefix={
        <Icon
          icon={"search"}
          color="text-gray-400 transition-colors duration-200 focus-within:!text-black"
        />
      }
      {...rest}
      size={"small"}
    />
  );
};
