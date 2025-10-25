import { useTranslation } from "react-i18next";

export function useAppConstants() {
  const { t } = useTranslation();

  const PARTNER_TYPES = [
    { value: 1, label: t("common.status.customer") },
    { value: 2, label: t("common.status.supplier") },
  ];

  const PARTNER_ADDRESS_TYPES = [
    {
      label: t("common.addressTypes.deliveryAddress"),
      value: 1,
    },
    {
      label: t("common.addressTypes.supplyAddress"),
      value: 2,
    },
    { label: t("common.addressTypes.office"), value: 4 },
  ];

  const PRODUCT_TYPES = [
    { value: 1, label: t("common.status.purchase") },
    { value: 2, label: t("common.status.production") },
    { value: 3, label: t("common.status.sale") },
  ];

  const LOCATION_TYPES = [
    { value: 1, label: t("common.location.vendor") },
    { value: 2, label: t("common.location.customer") },
    { value: 3, label: t("common.location.internal") },
    { value: 4, label: t("common.location.inventoryLoss") },
    { value: 5, label: t("common.location.production") },
    { value: 6, label: t("common.location.transit") },
    { value: 7, label: t("common.location.output") },
    { value: 8, label: t("common.location.scrap") },
  ];

  const PAYMENT_TYPES = [
    { value: 1, label: t("common.paymentType.transfer") },
    { value: 2, label: t("common.paymentType.cashless") },
    { value: 3, label: t("common.paymentType.electronic") },
    { value: 4, label: t("common.paymentType.app") },
  ];

  const PAYMENT_TYPE_STATUS = [
    { value: 1, label: t("common.paymentTypeStatus.notSelected") },
    { value: 2, label: t("common.paymentTypeStatus.byCount") },
    { value: 3, label: t("common.paymentTypeStatus.byPercent") },
  ];

  const CONTRACT_TYPES = [
    { value: 1, label: t("common.contractType.purchase") },
    { value: 2, label: t("common.contractType.sale") },
  ];

  const WORKTIME_TYPES = [
    { value: 1, label: t("salaryModule.workTimeTypeStatus.full") },
    { value: 2, label: t("salaryModule.workTimeTypeStatus.half") },
    { value: 3, label: t("salaryModule.workTimeTypeStatus.contract") },
  ];
  const VEHICLE_STATUS_TYPES = [
    { value: 1, label: t("common.status.available") },
    { value: 2, label: t("common.status.isUsed") },
    { value: 3, label: t("common.status.isFixed") },
    { value: 4, label: t("common.status.outOfUsage") },
  ];
  const ABOUT_STATUS_TYPES = [
    { value: 1, label: t("common.status.blocked") },
    { value: 2, label: t("common.status.active") },
    { value: 3, label: t("common.status.inventory") },
  ];

  const ROLE_TYPES = [
    { value: 1, label: t("common.role.admin") },
    { value: 2, label: t("common.role.hrManager") },
    { value: 3, label: t("common.role.saleManager") },
    { value: 4, label: t("common.role.purchaseManager") },
    { value: 5, label: t("common.role.warehouse") },
    { value: 6, label: t("common.role.accountant") },
    { value: 7, label: t("common.role.manufacture") },
    { value: 8, label: t("common.role.agent") },
    { value: 9, label: t("common.role.courier") },
  ];

  return {
    PARTNER_TYPES,
    PARTNER_ADDRESS_TYPES,
    PRODUCT_TYPES,
    LOCATION_TYPES,
    PAYMENT_TYPES,
    PAYMENT_TYPE_STATUS,
    CONTRACT_TYPES,
    WORKTIME_TYPES,
    VEHICLE_STATUS_TYPES,
    ABOUT_STATUS_TYPES,
    ROLE_TYPES,
  };
}
