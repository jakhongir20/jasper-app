import { ApiService } from "@/shared/lib/services";
import {
  PurchaseDocument,
  PurchaseWithoutDelivery,
  ReceiptProduct,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { ResponseData } from "@/shared/types/common";
import { Stage } from "@/features/purchase/order";

export class PWDService {
  static async create(
    formData: PurchaseWithoutDelivery,
  ): Promise<PurchaseWithoutDelivery> {
    return await ApiService.$post<PurchaseWithoutDelivery>(
      `/purchase-without-delivery/`,
      formData,
    );
  }

  static async createCargoStage(title: string): Promise<Stage> {
    return await ApiService.$post(`/logistic-stage/`, {
      title,
    });
  }

  static async createDuplicate(
    id: number | null,
  ): Promise<PurchaseWithoutDelivery> {
    return await ApiService.$post<PurchaseWithoutDelivery>(
      `/purchase-without-delivery/`,
      {},
      {
        params: {
          id,
        },
      },
    );
  }

  static async update(
    formData: PurchaseWithoutDelivery,
    guid: string,
  ): Promise<PurchaseWithoutDelivery> {
    return await ApiService.$patch<PurchaseWithoutDelivery>(
      `/purchase-without-delivery/${guid}/`,
      formData,
    );
  }

  static async delete(guid: string): Promise<void> {
    return await ApiService.$delete<void>(
      `/purchase-without-delivery/${guid}/`,
    );
  }

  static async getDetail(guid: string): Promise<PurchaseWithoutDelivery> {
    return await ApiService.$get<PurchaseWithoutDelivery>(
      `/purchase-without-delivery/${guid}/`,
    );
  }

  static async getCargo(id: number): Promise<ResponseData<PurchaseDocument>> {
    return await ApiService.$get<ResponseData<PurchaseDocument>>(
      `/purchase-pwd-logistic/?purchaseWithoutDelivery=${id}`,
    );
  }

  static async getProducts(id: number): Promise<ResponseData<ReceiptProduct>> {
    return await ApiService.$get<ResponseData<ReceiptProduct>>(
      `receipt-product/?purchaseWithoutDelivery=${id}`,
    );
  }

  static async getWarehouseLocations(warehouse: number): Promise<unknown> {
    if (!warehouse) return;

    return await ApiService.$get<void>(`/location/`, {
      params: {
        warehouse,
      },
    });
  }

  static async getPWDLogistics(
    purchaseWithoutDelivery: number,
  ): Promise<ResponseData<PurchaseDocument>> {
    return await ApiService.$get<ResponseData<PurchaseDocument>>(
      `/purchase-pwd-logistic/`,
      {
        params: {
          purchaseWithoutDelivery,
        },
      },
    );
  }
}
