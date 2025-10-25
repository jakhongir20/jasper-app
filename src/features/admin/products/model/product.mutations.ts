import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ProductService } from "./product.service";
import {
  CreateProductPayload,
  UpdateProductPayload,
  Product,
} from "./model.types";

export function useCreateProduct(
  options?: UseMutationOptions<Product, unknown, CreateProductPayload>,
) {
  const mutationFn: MutationFunction<Product, CreateProductPayload> = async (
    payload,
  ) => await ProductService.create(payload);

  return useMutation<Product, unknown, CreateProductPayload>({
    mutationKey: ["createProduct"],
    mutationFn,
    ...options,
  });
}

export function useUpdateProduct(
  options?: UseMutationOptions<
    Product,
    unknown,
    { productId: number; payload: UpdateProductPayload }
  >,
) {
  const mutationFn: MutationFunction<
    Product,
    { productId: number; payload: UpdateProductPayload }
  > = async ({ productId, payload }) =>
    await ProductService.update(productId, payload);

  return useMutation<
    Product,
    unknown,
    { productId: number; payload: UpdateProductPayload }
  >({
    mutationKey: ["updateProduct"],
    mutationFn,
    ...options,
  });
}

export function useDeleteProduct(
  options?: UseMutationOptions<void, unknown, number>,
) {
  const mutationFn: MutationFunction<void, number> = async (productId) =>
    await ProductService.delete(productId);

  return useMutation<void, unknown, number>({
    mutationKey: ["deleteProduct"],
    mutationFn,
    ...options,
  });
}
