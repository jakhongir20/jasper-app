import { FC } from "react";

import { getPurchaseTypeStatusLabel } from "@/shared/constants/getStatusLabel";
import { cn } from "@/shared/helpers";

export enum PurchaseTypeSTATUS {
  SALE_TO_PURCHASE = 1,
  SALE_TO_MANUFACTURE = 2,
  MANUFACTURE_TO_PURCHASE = 3,
  SALE_REFUND_REQUEST = 4,
  PURCHASE_REFUND_REQUEST = 5,
}

export type StatusType = keyof typeof PurchaseTypeSTATUS;

interface Props {
  className?: string;
  value: number;
}

const generateStatus = () => {
  return "text-black-100 ";
};

export const PurchaseTypeStatus: FC<Props> = ({ className, value }) => {
  const status = generateStatus();

  return (
    <div className={cn(className, status, "text-center")}>
      {getPurchaseTypeStatusLabel(+value)}
    </div>
  );
};
