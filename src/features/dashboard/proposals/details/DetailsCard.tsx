import type { FC } from "react";
import { cn } from "@/shared/helpers";
import { CInfoBadge, CNotation, ContentInner } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { CUserCard } from "@/shared/ui/common/CUserCard";
import type {
  PurchaseWithoutDelivery,
  PurchaseWithoutDeliveryList,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { formatDate, formatMoneyDecimal } from "@/shared/utils";

interface Props {
  className?: string;
  data: PurchaseWithoutDelivery & PurchaseWithoutDeliveryList;
}

export const DetailsCard: FC<Props> = ({ className, data }) => {
  const { t } = useTranslation();

  return (
    <ContentInner className={cn(className)}>
      <div className={"mt-1 flex flex-row gap-20"}>
        <CUserCard
          imgUrl={data.organization?.photo}
          title={data.organization?.title}
          subTitle={t("common.input.organization")}
        />
        <CUserCard
          imgUrl={data.partner?.photo}
          title={data.partner?.title}
          subTitle={t("common.input.partner")}
        />
      </div>

      <div className="my-5 flex gap-4">
        <CInfoBadge reversed subValue={t("common.status.closed") + ":"}>
          <span className="text-green">{data?.closedAmount}</span>
        </CInfoBadge>
        <CInfoBadge reversed subValue={t("common.table.remaining") + ":"}>
          <span className="text-red">
            {formatMoneyDecimal(data?.openAmount)}
          </span>
        </CInfoBadge>
        <CInfoBadge reversed subValue={t("common.input.currency") + ":"}>
          {data?.currency?.code}
        </CInfoBadge>

        <CInfoBadge reversed subValue={t("common.details.createdDate") + ":"}>
          {formatDate(data?.registrationDate)}
        </CInfoBadge>

        <CInfoBadge
          reversed
          subValue={t("common.table.creator")}
          imageUrl={data?.recorder?.photo}
        >
          {data.recorder?.first_name ?? "-"} {data.recorder?.last_name}
        </CInfoBadge>
      </div>

      <CNotation
        label={t("common.details.comment")}
        value={data?.note || "--"}
      />
    </ContentInner>
  );
};
