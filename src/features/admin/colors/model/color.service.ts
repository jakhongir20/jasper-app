import { apiService } from "@/shared/lib/services/ApiService";
import { Color, CreateColorPayload, UpdateColorPayload } from "./model.types";

export class ColorService {
  static async getAll(): Promise<Color[]> {
    return await apiService.$get<Color[]>("/color/all");
  }

  static async getById(colorId: number): Promise<Color> {
    return await apiService.$get<Color>(`/admin/color?color_id=${colorId}`);
  }

  static async create(payload: CreateColorPayload): Promise<Color> {
    return await apiService.$post<Color>("/admin/color", payload);
  }

  static async update(payload: UpdateColorPayload): Promise<Color> {
    const { color_id, ...data } = payload;
    return await apiService.$put<Color>(`/admin/color?color_id=${color_id}`, data);
  }

  static async delete(colorId: number): Promise<void> {
    return await apiService.$delete(`/admin/color?color_id=${colorId}`);
  }
}
