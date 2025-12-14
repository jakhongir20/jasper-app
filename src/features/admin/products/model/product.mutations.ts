import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import {
  CreateProductPayload,
  UpdateProductPayload,
} from "./model.types";
import { useAdminProductImageDeleteAdminProductImageDelete } from "@/shared/lib/api/generated/gateway/product-images/product-images";

export function useCreateProduct(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (payload: CreateProductPayload) => ProductService.create(payload),
    onSuccess: () => {
      // Invalidate products list cache
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useUpdateProduct(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: ({ productId, payload }: { productId: number; payload: UpdateProductPayload }) =>
      ProductService.update(productId, payload),
    onSuccess: (_data, variables) => {
      // Invalidate both list and detail caches
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      queryClient.invalidateQueries({ queryKey: ["product-detail", variables.productId] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useDeleteProduct(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: (productId: number) => ProductService.delete(productId),
    onSuccess: () => {
      // Invalidate products list cache
      queryClient.invalidateQueries({ queryKey: ["products-list"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export { useAdminProductImageDeleteAdminProductImageDelete as useDeleteProductImage };
