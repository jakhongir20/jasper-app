import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ProductService } from "./product.service";
import { Product } from "./model.types";

export function useProductDetail(productId: number): UseQueryResult<Product> {
  return useQuery<Product>({
    queryKey: ["product-detail", productId],
    queryFn: () => ProductService.getById(productId),
    enabled: !!productId,
  });
}

export function useProductsList(): UseQueryResult<Product[]> {
  return useQuery<Product[]>({
    queryKey: ["products-list"],
    queryFn: () => ProductService.getAll(),
  });
}
