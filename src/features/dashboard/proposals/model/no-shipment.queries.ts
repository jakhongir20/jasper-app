import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { PWDService } from "@/features/purchase/no-ship/model";
import type {
  PurchaseDocument,
  PurchaseWithoutDelivery,
  PurchaseWithoutDeliveryList,
  ReceiptProduct,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import { ResponseData } from "@/shared/types/common";

export function useGetLocations<T = unknown>(id: number): UseQueryResult<T> {
  return useQuery({
    queryKey: ["pwd-warehouse-locations"],
    queryFn: () => PWDService.getWarehouseLocations(id),
    enabled: !!id,
  });
}

export function usePWDDetail(
  guid: string,
): UseQueryResult<PurchaseWithoutDelivery & PurchaseWithoutDeliveryList> {
  return useQuery({
    queryKey: ["pwd-detail", guid],
    queryFn: () => PWDService.getDetail(guid),
    enabled: !!guid,
  });
}

export function usePWDCargo(
  id: number,
): UseQueryResult<ResponseData<PurchaseDocument>> {
  return useQuery({
    queryKey: ["pwd-single-cargo"],
    queryFn: () => PWDService.getCargo(id),
    enabled: !!id,
  });
}

export function usePWDLogistics(
  id: number,
): UseQueryResult<ResponseData<PurchaseDocument>> {
  return useQuery({
    queryKey: ["pwd-logistics"],
    queryFn: () => PWDService.getPWDLogistics(id),
    enabled: !!id,
  });
}

export function usePWDProducts(
  id: number,
): UseQueryResult<ResponseData<ReceiptProduct>> {
  return useQuery({
    queryKey: ["pwd-products"],
    queryFn: () => PWDService.getProducts(id),
    enabled: !!id,
  });
}
