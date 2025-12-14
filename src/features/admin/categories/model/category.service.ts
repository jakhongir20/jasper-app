import { apiService } from "@/shared/lib/services/ApiService";
import {
  Category,
  CreateCategoryPayload,
  GetCategoriesParams,
  PaginatedCategoriesResponse,
  UpdateCategoryPayload,
} from "./model.types";

export class CategoryService {
  static async getAll(
    params?: GetCategoriesParams,
  ): Promise<PaginatedCategoriesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.offset !== undefined) {
      queryParams.append("offset", params.offset.toString());
    }

    if (params?.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/category/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return await apiService.$get<PaginatedCategoriesResponse>(url);
  }

  static async getAllSimple(): Promise<Category[]> {
    return await apiService.$get<Category[]>("/category/all");
  }

  static async getById(categoryId: number): Promise<Category> {
    return await apiService.$get<Category>(
      `/admin/category?category_id=${categoryId}`,
    );
  }

  static async create(payload: CreateCategoryPayload): Promise<Category> {
    return await apiService.$post<Category>("/admin/category", payload);
  }

  static async update(payload: UpdateCategoryPayload): Promise<Category> {
    const { category_id, ...updateData } = payload;
    return await apiService.$patch<Category>(
      `/admin/category?category_id=${category_id}`,
      updateData,
    );
  }

  static async delete(categoryId: number): Promise<void> {
    return await apiService.$delete(
      `/admin/category?category_id=${categoryId}`,
    );
  }
}
