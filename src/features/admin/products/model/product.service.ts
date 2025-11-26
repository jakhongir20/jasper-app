import { apiService } from "@/shared/lib/services/ApiService";
import {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "./model.types";

export class ProductService {
  static async getAll(): Promise<Product[]> {
    return await apiService.$get<Product[]>("/admin/product/all");
  }

  static async getById(productId: number): Promise<Product> {
    return await apiService.$get<Product>(`/product?product_id=${productId}`);
  }

  static async create(payload: CreateProductPayload): Promise<Product> {
    return await apiService.$post<Product>("/admin/product", payload);
  }

  static async update(
    productId: number,
    payload: UpdateProductPayload,
  ): Promise<Product> {
    return await apiService.$put<Product>(
      `/admin/product?product_id=${productId}`,
      payload,
    );
  }

  static async delete(productId: number): Promise<void> {
    return await apiService.$delete(`/admin/product?product_id=${productId}`);
  }
}
