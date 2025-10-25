/**
 * All possible permission types
 */
export type PermissionType =
  | "AUDIT"
  | "ANALYTIC"
  | "FINANCE"
  | "CRM"
  | "PRODUCT"
  | "PURCHASE"
  | "SALE"
  | "WAREHOUSE"
  | "MANUFACTURE"
  | "REQUEST"
  | "REPORT"
  | "LOGISTIC";

/**
 * Possible models under each type.
 * If a particular type has no tables, use `never`.
 */
export type AuditModel = "log" | "usersession" | "failedattempt";
export type AnalyticModel = never; // no tables
export type FinanceModel =
  | "currency"
  | "tax"
  | "taxcategory"
  | "discount"
  | "salary"
  | "salarybill"
  | "staffpayment"
  | "outcome"
  | "income"
  | "paymentcategory"
  | "kpi"
  | "kpiassignment"
  | "kpireward";
export type CRMModel =
  | "partner"
  | "user"
  | "country"
  | "region"
  | "district"
  | "timetable"
  | "partnergroup"
  | "partneroccupation"
  | "organization"
  | "organizationtype"
  | "notification"
  | "balancehistory"
  // new types
  | "agent"
  | "staff";
export type ProductModel =
  | "productcategory"
  | "product"
  | "producttag"
  | "barcode"
  | "uom"
  | "uomcategory"
  | "manufacturer"
  // new types
  | "quantity"
  | "seria"
  | "pricehistory";
export type PurchaseModel =
  | "purchase"
  | "purchaseproduct"
  | "purchaseorder"
  | "purchaseorderproduct"
  | "purchasewithoutdelivery"
  | "purchasewithoutdeliveryproduct"
  | "refund"
  | "refundproduct"
  // new types
  | "request"
  | "receipt";
export type SaleModel =
  | "offer"
  | "offerproduct"
  | "order"
  | "orderproduct"
  | "sale"
  | "saleproduct"
  | "salewithoutshipment"
  | "salewithoutshipmentproduct"
  | "shipment"
  | "shipmentproduct"
  | "contract"
  | "contractproduct"
  // new types
  | "requestrefund"
  | "salerefund"
  | "expense"
  | "salerequest";
export type WarehouseModel =
  | "warehouse"
  | "warehousestaff"
  | "receipt"
  | "receiptproduct"
  | "distribution"
  | "distributionbatch"
  | "distributionproduct"
  | "inventory"
  | "inventoryproduct"
  | "relocate"
  | "relocateproduct"
  | "warehouseexpense"
  | "warehouseexpenseproduct"
  // new types
  | "products"
  | "warehouserequest"
  | "warehouseseria"
  | "warehousereceipt";
export type ManufactureModel =
  | "technologicalmap"
  | "technologicalmaprawmaterial"
  | "manufactureorder"
  | "manufactureorderproduct"
  | "manufactureorderrawmaterial"
  | "manufacture"
  | "manufacturerawmaterial"
  | "stage"
  // new types
  | "manufacturewarehouse"
  | "template"
  | "manufacturerequest";
export type SettingsModel =
  | "role"
  | "safety"
  | "subscription"
  | "about"
  | "settings";
export type LogisticModel = "logistic" | "vehicle" | "vehicletype" | "fueltype";
export type RequestModel = "request" | "requestproduct";
export type ReportModel = never; // no tables

/**
 * Union of all models from all types
 */
export type PermissionModel =
  | AuditModel
  | AnalyticModel
  | FinanceModel
  | CRMModel
  | ProductModel
  | PurchaseModel
  | SaleModel
  | WarehouseModel
  | ManufactureModel
  | RequestModel
  | ReportModel
  | LogisticModel
  | SettingsModel;

/**
 * Possible actions within a table/model
 */
export type PermissionAction = "view" | "add" | "change" | "delete";

/**
 * Each table item includes a model plus its actions.
 */
export interface PermissionTable {
  model: PermissionModel;
  actions: PermissionAction[];
}

/**
 * A permission section contains multiple tables.
 */
export interface PermissionSection {
  id?: number;
  key: string;
  sectionId: number;
  model: string;
  type: PermissionType;
  title: string;
  tables: PermissionTable[];
}

export interface Permission {
  model: PermissionModel;
  action: PermissionAction;
  isOwn?: boolean;
}

/**
 * The top-level data is an array of permission sections.
 */
export type PermissionData = PermissionSection[];
