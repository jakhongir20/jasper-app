export enum DuplicateType {
  Offer = 1,
  Order,
  Sale,
  Shipment,
  SaleWithoutShipment,
  Request = 11,
  PurchaseOrder,
  Purchase,
  Receipt,
  PurchaseWithoutDelivery,
  Refund,
  Logistic,
  Outcome,
  Income,
}

export type DuplicateModule =
  | "order" // order for sale
  | "sale"
  | "offer"
  | "shipment"
  | "saleWithoutShipment"
  | "purchaseWithoutDelivery"
  | "request"
  | "receipt"
  | "purchaseOrder" // order for purchase;
  | "purchase"
  | "refund"
  | "logistic"
  | "outcomePayment"
  | "incomePayment";

export const mapDuplicateTypeToModule = (
  type: DuplicateType,
): DuplicateModule => {
  switch (type) {
    case DuplicateType.Offer:
      return "offer";
    case DuplicateType.Order:
      return "order";
    case DuplicateType.Sale:
      return "sale";
    case DuplicateType.Shipment:
      return "shipment";
    case DuplicateType.SaleWithoutShipment:
      return "saleWithoutShipment";
    case DuplicateType.PurchaseWithoutDelivery:
      return "purchaseWithoutDelivery";
    case DuplicateType.Request:
      return "request";
    case DuplicateType.Receipt:
      return "receipt";
    case DuplicateType.PurchaseOrder:
      return "purchaseOrder";
    case DuplicateType.Purchase:
      return "purchase";
    case DuplicateType.Refund:
      return "refund";
    case DuplicateType.Logistic:
      return "logistic";
    case DuplicateType.Outcome:
      return "outcomePayment";
    case DuplicateType.Income:
      return "incomePayment";
  }
};
