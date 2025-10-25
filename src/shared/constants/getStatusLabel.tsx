import { t } from "i18next";

import { AboutSTATUS } from "@/shared/ui/status/AboutStatus";
import { SalaryBillSTATUS } from "@/shared/ui/status/SalaryBillStatus";
import { VehicleSTATUS } from "@/shared/ui/status/VehicleStatus";
import { PurchaseTypeSTATUS } from "@/shared/ui/status/PurchaseTypeStatus";

enum Status {
  Draft = 1,
  Open = 2,
  Pending = 3,
  InProgress = 4,
  Mixed = 5,
  Received = 6,
  Confirming = 7,
  Closed = 8,
  Canceled = 9,
  Deleted = 10,
  Paid = 11,
  Archived = 12,
  Incoming = 13,
  Qualification = 14,
  Moved = 15,
  Active = 16,
  InActive = 17,
  GreenActive = 20,
  GreenConfirmed = 30,
}

enum SalaryStatus {
  Added = 1,
  notAdded = 2,
}

export const getStatusLabel = (statusCode: number): string => {
  const statusMap: Record<Status, string> = {
    [Status.Draft]: t("common.status.draft"),
    [Status.Open]: t("common.status.open"),
    [Status.Pending]: t("common.status.pending"),
    [Status.InProgress]: t("common.status.inProgress"),
    [Status.Mixed]: t("common.status.mixed"),
    [Status.Received]: t("common.status.received"),
    [Status.Confirming]: t("common.status.confirming"),
    [Status.Closed]: t("common.status.closed"),
    [Status.Canceled]: t("common.status.canceled"),
    [Status.Deleted]: t("common.status.deleted"),
    [Status.Paid]: t("common.status.paid"),
    [Status.Archived]: t("common.status.archived"),
    [Status.Incoming]: t("common.status.incoming"),
    [Status.Qualification]: t("common.status.qualification"),
    [Status.Moved]: t("common.status.moved"),
    [Status.Active]: t("common.status.active"),
    [Status.InActive]: t("common.status.inactive"),
    [Status.GreenActive]: t("common.status.active"),
    [Status.GreenConfirmed]: t("common.status.confirming"),
  };

  return statusMap[statusCode as Status] || t("status.unknown");
};

export const getLogisticsStatusLabel = (statusCode: number): string => {
  const statusMap: Record<Status, string> = {
    [Status.Draft]: t("common.status.draft"),
    [Status.Open]: t("common.status.open"),
    [Status.Pending]: t("common.status.pending"),
    [Status.Closed]: t("common.status.closed"),
    [Status.Canceled]: t("common.status.canceled"),
    [Status.Active]: t("common.status.inTransit"),
    [Status.InActive]: t("common.status.delivered"),
  };

  return statusMap[statusCode as Status] || t("status.unknown");
};

export const getPurchaseTypeStatusLabel = (statusCode: number): string => {
  const statusMap: Record<PurchaseTypeSTATUS, string> = {
    [PurchaseTypeSTATUS.SALE_TO_PURCHASE]: t("common.status.saleToPurchase"),
    [PurchaseTypeSTATUS.SALE_TO_MANUFACTURE]: t(
      "common.status.saleToManufacture",
    ),
    [PurchaseTypeSTATUS.MANUFACTURE_TO_PURCHASE]: t(
      "common.status.manufactureToPurchase",
    ),
    [PurchaseTypeSTATUS.SALE_REFUND_REQUEST]: t(
      "common.status.saleRefundRequest",
    ),
    [PurchaseTypeSTATUS.PURCHASE_REFUND_REQUEST]: t(
      "common.status.purchaseRefundRequest",
    ),
  };

  return statusMap[statusCode as PurchaseTypeSTATUS] || t("status.unknown");
};

export const getSalaryStatusLabel = (statusCode: number): string => {
  const statusMap: Record<SalaryStatus, string> = {
    [SalaryStatus.Added]: t("common.status.added"),
    [SalaryStatus.notAdded]: t("common.status.notAdded"),
  };

  return statusMap[statusCode as SalaryStatus] || t("status.unknown");
};

export const getAboutStatusLabel = (statusCode: number): string => {
  const statusMap: Record<AboutSTATUS, string> = {
    [AboutSTATUS.blocked]: t("common.status.blocked"),
    [AboutSTATUS.active]: t("common.status.active"),
    [AboutSTATUS.inventory]: t("common.status.inventory"),
  };

  return statusMap[statusCode as AboutSTATUS] || t("status.unknown");
};

export const getSalaryBillStatusLabel = (statusCode: number): string => {
  const statusMap: Record<SalaryBillSTATUS, string> = {
    [SalaryBillSTATUS.draft]: t("common.status.draft"),
    [SalaryBillSTATUS.paid]: t("common.status.paid"),
    [SalaryBillSTATUS.canceled]: t("common.status.canceled"),
  };

  return statusMap[statusCode as SalaryStatus] || t("status.unknown");
};
export const getVehicleStatusLabel = (statusCode: number): string => {
  const statusMap: Record<VehicleSTATUS, string> = {
    [VehicleSTATUS.available]: t("common.status.available"),
    [VehicleSTATUS.isUsed]: t("common.status.isUsed"),
    [VehicleSTATUS.isFixed]: t("common.status.isFixed"),
    [VehicleSTATUS.outOfUsage]: t("common.status.outOfUsage"),
  };

  return statusMap[statusCode as SalaryStatus] || t("status.unknown");
};
