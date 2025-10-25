import { Input as AntDInput, InputProps as AntDInputProps } from "antd";
import { FC } from "react";

import { cn } from "@/shared/helpers";
import { Icon } from "@/shared/ui";

interface Props extends AntDInputProps {
  className?: string;
  placeholder?: string;
}

export const InputPassword: FC<Props> = ({
  className,
  placeholder,
  ...rest
}) => {
  return (
    <AntDInput.Password
      placeholder={placeholder}
      iconRender={(visible) =>
        !visible ? (
          <Icon icon={"eye-slash"} color={"size-5  cursor-pointer"} />
        ) : (
          <Icon icon={"eye"} color={"size-5 cursor-pointer"} />
        )
      }
      className={cn("variant-filled min-h-10", className)}
      {...rest}
    />
  );
};
