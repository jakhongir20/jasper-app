import { Tabs as TabsUI, TabsProps } from "antd";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { cn } from "@/shared/helpers";
import { TabBadge } from "@/shared/ui";

interface Props extends TabsProps {
  className?: string;
  items: TabsProps["items"];
  activeTabKey?: string;
  useQuery?: boolean;
  onChange?: (key: string) => void;
}

export const Tabs: FC<Props> = ({
  className,
  items = [],
  activeTabKey = "1",
  useQuery = true,
  onChange,
  ...rest
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabQuery = useQuery
    ? searchParams.get("tab") || activeTabKey
    : activeTabKey;

  const [activeTab, setActiveTab] = useState(tabQuery);

  useEffect(() => {
    if (useQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery, useQuery]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    onChange?.(key);

    if (useQuery) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("tab", key);
      setSearchParams(newSearchParams);
    }
  };

  const updatedItems: TabsProps["items"] = items.map((item: any) => ({
    ...item,
    label: (
      <div className="flex items-center gap-2 px-3 text-sm">
        {item.label}
        {item.count !== undefined && <TabBadge count={item?.count} />}
      </div>
    ),
    children: <>{item.children}</>,
    forceRender: true,
  }));

  return (
    <TabsUI
      activeKey={activeTab}
      items={updatedItems}
      onChange={handleTabChange}
      tabBarGutter={0}
      destroyOnHidden={false}
      tabBarStyle={{ margin: "0" }}
      rootClassName={"[&_.ant-tabs-nav-list]:!mx-5"}
      className={cn(className, "")}
      {...rest}
    />
  );
};
