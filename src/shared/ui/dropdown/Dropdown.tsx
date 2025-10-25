import React, { FC } from "react";
import {
  Dropdown as AntDDropdown,
  DropdownProps,
  MenuProps,
  theme,
} from "antd";

interface Props extends Partial<DropdownProps> {
  items?: MenuProps["items"]; // Optional items
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode; // Allow children
}

const { useToken } = theme;

export const Dropdown: FC<Props> = ({
  items,
  open,
  onOpenChange,
  trigger = ["click"],
  popupRender,
  children,
  ...rest
}) => {
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    margin: "auto",
    marginLeft: 8,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  return (
    <AntDDropdown
      menu={items ? { items } : undefined} // Use menu if items are provided
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      popupRender={
        popupRender
          ? (menu) => (
              <div style={contentStyle}>
                {menu &&
                  React.cloneElement(
                    menu as React.ReactElement<{
                      style: React.CSSProperties;
                    }>,
                    { style: menuStyle },
                  )}
                {children} {/* Render children if provided */}
              </div>
            )
          : undefined
      }
      {...rest}
    >
      <div>
        {children} {/* Render children in trigger area */}
      </div>
    </AntDDropdown>
  );
};
