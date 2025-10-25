import { FC, ReactNode } from "react";
import { Badge as AntDBadge, BadgeProps as AntDBadgeProps } from "antd";

interface Props extends AntDBadgeProps {
  children?: ReactNode;
}

export const Badge: FC<Props> = ({ children, ...rest }) => {
  return (
    <AntDBadge
      rootClassName={
        "[&_.ant-scroll-number-only]:!text-[11px] [&_.ant-scroll-number]:!w-5 [&_.ant-scroll-number]:!h-[15px] [&_.ant-scroll-number]:!flex [&_.ant-scroll-number]:!items-center [&_.ant-scroll-number]:!justify-center [&_.ant-scroll-number]:!justify-center [&_.ant-badge.ant-badge-count]:!shadow-red-100"
      }
      {...rest}
    >
      {children}
    </AntDBadge>
  );
};
