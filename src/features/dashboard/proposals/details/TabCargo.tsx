import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { PurchaseDocument } from "@/features/purchase/no-ship/model/no-shipment.types";
import { formattedPrice } from "@/shared/helpers";
import { CInfo, Collapse } from "@/shared/ui";
import { EmptyTable } from "@/shared/ui/table";

interface Props {
  data: PurchaseDocument[];
}

export const TabCargo: FC<Props> = ({ data }) => {
  const { t } = useTranslation();

  const ITEMS = useMemo(() => {
    return data.map((cargo, index) => ({
      key: index + 1,
      label: `${t("purchaseModule.add.cargo")} ${index + 1}`,
      children: (
        <div className={"grid grid-cols-5 gap-5"}>
          <CInfo
            value={t("common.input.deliveryType")}
            subValue={cargo?.shippingType?.title}
          />
          <CInfo
            value={t("common.input.step")}
            subValue={cargo?.stage?.title || "-"}
          />
          <CInfo
            value={t("common.input.shipping")}
            subValue={cargo?.shippingAddress || "-"}
          />
          <CInfo
            value={t("common.input.deliveryAddress")}
            subValue={cargo?.deliveryAddress || "-"}
          />
          <CInfo
            value={t("common.input.summa")}
            subValue={cargo?.amount ? formattedPrice(cargo?.amount) : "-"}
          />
          <CInfo
            value={t("common.input.currency")}
            subValue={cargo?.currency?.name || "-"}
          />
          <CInfo
            value={t("common.input.sender")}
            subValue={cargo?.sender || "-"}
          />
          <CInfo
            value={t("common.input.recipient")}
            subValue={cargo?.recipient || "-"}
          />
          <CInfo
            value={t("common.label.overallSum")}
            subValue={t(
              "common.details." +
                (cargo?.isOverallSumActivate ? "allowed" : "notAllowed"),
            )}
          />
          <CInfo
            value={t("common.label.extraCost")}
            subValue={t(
              "common.details." +
                (cargo?.isAddCostPrice ? "allowed" : "notAllowed"),
            )}
          />

          <CInfo value={t("common.input.note")} subValue={cargo?.note || "-"} />
        </div>
      ),
    }));
  }, [data]);

  if (!data.length) return <EmptyTable showAddButton={false} />;
  return <Collapse items={ITEMS} />;
};
