import type { IconType } from "@/shared/types";
import {
  DUPLICATE_TYPES,
  PWD_CREATE_TYPES,
} from "@/features/purchase/no-ship/ui";

type PurchaseType = {
  name: string;
  icon?: IconType;
  value: PWD_CREATE_TYPES;
};

type DuplicateType = {
  name: string;
  value: DUPLICATE_TYPES;
};

export const CREATE_SHIPMENT_ICONS: PurchaseType[] = [
  {
    icon: "purchase-new-ship",
    name: "purchaseModule.add.create_new_shipment",
    value: PWD_CREATE_TYPES.NEW,
  },
  {
    icon: "purchase-existing",
    name: "purchaseModule.add.duplicate_from_purchases",
    value: PWD_CREATE_TYPES.DUPLICATE,
  },
];

export const DUPLICATE_ORDER: DuplicateType[] = [
  {
    name: "common.details.sale",
    value: DUPLICATE_TYPES.SALE,
  },
  {
    name: "common.details.offer",
    value: DUPLICATE_TYPES.OFFER,
  },
];
