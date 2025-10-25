import { Button as ButtonUI, ButtonProps as AntButtonProps } from "antd";
import { type FC, ReactNode } from "react";

interface Props extends AntButtonProps {
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  bg?: string;
}

export const Button: FC<Props> = ({
  className,
  children,
  icon,
  loading = false,
  variant = "solid",
  ...rest
}) => {
  return (
    <ButtonUI
      loading={loading}
      variant={variant}
      className={`flex items-center !gap-1 px-6 py-2.5 leading-[18.2px] shadow-none ${className}`}
      rootClassName={rest.color === "danger" ? "!bg-red hover:!bg-red-200" : ""}
      {...rest}
      icon={
        icon ? (
          <span className={"flex items-center justify-center"}>{icon}</span>
        ) : undefined
      }
    >
      {children}
    </ButtonUI>
  );
};
