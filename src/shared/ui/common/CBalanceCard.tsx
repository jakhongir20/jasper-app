import { FC } from "react";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";
import { formatMoneyDecimal } from "@/shared/utils";

interface Props {
  className?: string;
  partnerBalance: number;
  totalAmount: number;
  openAmount: number;
  closedAmount: number;
  documentTotalAmount?: number;
  documentOpenAmount?: number;
  documentClosedAmount?: number;
  currencySymbol?: string;
}

export const CBalanceCard: FC<Props> = ({
  className,
  partnerBalance,
  totalAmount,
  openAmount,
  closedAmount,
  documentTotalAmount,
  documentOpenAmount,
  documentClosedAmount,
  currencySymbol,
}) => {
  const positiveBalance = partnerBalance >= 0;
  const { t } = useTranslation();

  type CardItemProps = {
    title: string;
    amount: number;
    documentAmount?: number;
    currencySymbol?: string;
  };

  const CardItem = ({
    title,
    amount,
    documentAmount,
    currencySymbol,
  }: CardItemProps) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="text-sm font-semibold text-gray-200">
        {formatMoneyDecimal(amount)}
      </p>
      <p className="text-sm font-semibold text-gray-200">
        {formatMoneyDecimal(Number(documentAmount) || 0)}
        {currencySymbol}
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        "mt-1 w-[60%] rounded-md border border-dashed px-3 py-2",
        positiveBalance ? "border-green" : "border-red",
        className,
      )}
    >
      <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-4">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            {t("common.details.partnerBalance")}
          </p>
          <p
            className={cn(
              "text-lg font-semibold",
              positiveBalance ? "text-green" : "text-red",
            )}
          >
            {formatMoneyDecimal(partnerBalance)}
          </p>
        </div>
        <CardItem
          title={t("common.details.total")}
          amount={totalAmount}
          documentAmount={documentTotalAmount}
          currencySymbol={currencySymbol}
        />
        <CardItem
          title={t("common.details.open")}
          amount={openAmount}
          documentAmount={documentOpenAmount}
          currencySymbol={currencySymbol}
        />
        <CardItem
          title={t("common.details.close")}
          amount={closedAmount}
          documentAmount={documentClosedAmount}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
};
