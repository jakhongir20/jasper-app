import { WarehouseDetails } from "@/features/warehouse/warehouses/model";
import { Discount, Option, Organization, Partner } from "@/shared/types";
import { STATUS } from "@/shared/ui/status/Status";

export type PurchaseWithoutDelivery = {
  code: string;
  partner: number;
  organization: number;
  partnerAmount: string;
  transportationAmount: string;
  currency: number;
  documentCurrency: string;
  documentTotalAmount: string;
  discountPercent: string;
  discountAmount: number;
  taxPercent: string;
  taxAmount: number;
  totalAmount: number;
  closedAmount: string;
  openAmount: string;
  documentClosedAmount: string;
  documentOpenAmount: string;
  status: number;
  note: string;
  registrationDate: string;
  recorder: number;
  warehouse: Discount;
  products: ArrivalProduct[];
  logistics: Logistics[];
};

export type ArrivalProduct = {
  id?: number;
  receipt: number;
  refund: number;
  manufacture: number;
  purchaseWithoutDelivery: number;
  batch: string;
  seria: number | Option;
  product: number;
  discountPercent: string;
  discountAmount: string;
  taxPercent: string;
  taxAmount: string;
  uom: number | Option;
  taxes: (number | Option)[];
  quantity: number;
  baseQuantity: string;
  unitPrice: number;
  totalAmount: string;
  warehouse: number;
  location: number[];
  costPrice: string;
  declaration: string;
  currency: number;
  expiredDate: string;
  registrationDate: string;
  recorder: number;
  isConfirmed: boolean;
  expenseProducts: string;
  expenseAmount: string;
  discount: (number | Option)[];
  _uid?: string;
  taxesOriginal?: Discount[];
  discountOriginal?: Discount[];
};

export type Logistics = {
  code: string;
  partner: number;
  shippingType: number | (Option & Discount);
  shippingAddress: string;
  deliveryAddress: string;
  amount: string;
  documentAmount: string;
  currency: number | (Option & Discount);
  stage: number | (Option & Discount);
  sender: string;
  recipient: string;
  note: string;
  isOverallSumActivate: boolean;
  isAddCostPrice: boolean;
  isInvoiceCreate: boolean;
  extra_data: string;
  registrationDate: string;
  recorder: number;
  purchaseWithoutDelivery: number;
};

type Category = {
  id: number;
  guid: string;
  title: string;
};

type UOM = {
  id: number;
  guid: string;
  title: string;
  shortName: string;
  type: number;
  rounding: number;
  is_active: boolean;
};

type Currency = {
  id: number;
  guid: string;
  code: string;
  symbol: string;
  name: string;
};

type Warehouse = {
  id: number;
  guid: string;
  title: string;
};

type Recorder = {
  id: number;
  guid: string;
  username: string;
  first_name: string;
  last_name: string;
  surname: string;
  photo: string;
  birthday: string;
  gender: number;
  role: number;
};

export type Product = {
  quantity: number;
  id: number;
  guid: string;
  code: string;
  title: string;
  category: Category;
  uom: UOM;
  currency: Currency;
  purchasePrice: string;
  salePrice: string;
  costPrice: string;
  warehouse: Warehouse;
  minQuantity: string;
  photo: string;
  status: number;
  type: number;
  mxikCode: string;
  packageCode: string;
  registrationDate: string;
  recorder: Recorder;
  _uid?: string;
  actualQuantity?: number;
};

export type Taxes = { results: { id: number; percent: string }[] };

export type PurchaseWithoutDeliveryList = {
  id: number;
  guid: string;
  code?: string | null;
  partner: Partner;
  organization: Organization;
  discountPercent: string;
  discountAmount: string;
  taxPercent?: string;
  taxAmount?: string;
  closedAmount?: string;
  openAmount?: string;
  documentClosedAmount?: string;
  documentOpenAmount?: string;
  status: STATUS;
  registrationDate: string;
  warehouse: WarehouseDetails;
  currency: Currency;
  recorder: Recorder;
  totalAmount?: number;
  product: Product;
};

export type PWDForm = {
  general: Omit<PurchaseWithoutDelivery, "products" | "logistics">;
  cargo: PurchaseWithoutDelivery["logistics"];
  products: PurchaseWithoutDelivery["products"];
};

type ShippingType = {
  id: number;
  guid: string;
  title: string;
};

type Stage = {
  id: number;
  guid: string;
  title: string;
};

export type PurchaseDocument = {
  id: number;
  guid: string;
  code: string;
  partner: Partner;
  shippingType: ShippingType;
  shippingAddress: string;
  deliveryAddress: string;
  amount: string;
  documentAmount: string;
  currency: Currency;
  stage: Stage;
  sender: string;
  recipient: string;
  note: string;
  isOverallSumActivate: boolean;
  isAddCostPrice: boolean;
  isInvoiceCreate: boolean;
  extra_data: string;
  registrationDate: string;
  recorder: Recorder;
};

export type ReceiptProduct = Omit<Product, "_uid"> & {
  batch: string;
  product: Product;
  quantity: number;
  discount: Discount[];
  taxes: Discount[];
  _uid?: string;
  totalAmount: string;
  location: Discount;
  seria: Discount;
  expiredDate: string;
};
