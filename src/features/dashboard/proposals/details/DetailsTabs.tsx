import type { FC } from "react";

import { ContentInner, Tabs } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import {
  TabCargo,
  TabTableProducts,
} from "@/features/purchase/no-ship/details";
import { PurchaseDocument } from "@/features/purchase/no-ship/model/no-shipment.types";

interface Props {
  cargo?: PurchaseDocument[];
  dataId: number;
}

export const DetailsTabs: FC<Props> = ({ cargo, dataId }) => {
  const { t } = useTranslation();

  const tabs = [
    {
      key: "1",
      label: t("productServiceModule.navigation.products"),
      children: <TabTableProducts dataId={dataId} />,
    },
    {
      key: "2",
      label: t("purchaseModule.add.cargo"),
      disabled: true,
      // children: (
      //   <ContentInner className="pt-2">
      //     <TabCargo data={cargo} />
      //   </ContentInner>
      // ),
    },
  ];

  return <Tabs items={tabs} activeTabKey={"1"} />;
};
