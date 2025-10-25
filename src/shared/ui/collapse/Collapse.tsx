import { FC } from "react";
import { Collapse as CollapseUI, type CollapseProps } from "antd";
import { Icon } from "@/shared/ui";
import { cn, rotateIcon } from "@/shared/helpers";
import "./index.css";

interface Props {
  className?: string;
  items: CollapseProps["items"];
  defaultActiveKey?: string | string[];
  activeKey?: string | string[];
  onChange?: (key: string | string[]) => void;
}

export const Collapse: FC<Props> = ({
  className,
  items: collapseItems,
  onChange,
  defaultActiveKey = ["1"],
  activeKey,
}) => {
  const items: CollapseProps["items"] = collapseItems?.map((item) => {
    return {
      ...item,
      label: <div className="text-lg font-semibold">{item.label}</div>,
      children: <div>{item.children}</div>,
      extra: item.extra,
      forceRender: true,
    };
  });

  return (
    <CollapseUI
      className={cn("", className)}
      rootClassName="c-collapse"
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={onChange}
      expandIconPosition="end"
      expandIcon={({ isActive }) => {
        return (
          <div className="flex h-7 w-7 items-center justify-center">
            <Icon
              icon="chevron-down-lg"
              color={isActive ? "!text-violet" : "!text-black"}
              className={cn(rotateIcon(isActive))}
              width={14}
            />
          </div>
        );
      }}
      items={items}
      bordered={false}
    />
  );
};
