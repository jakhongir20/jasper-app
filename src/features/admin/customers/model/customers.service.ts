import { apiService } from "@/shared/lib/services/ApiService";

export class CustomersService {
  // static async getAll(): Promise<Color[]> {
  //   return await apiService.$get<Color[]>("/color/all");
  // }

  // static async getById(colorId: number): Promise<Color> {
  //   return await apiService.$get<Color>(`/admin/color?color_id=${colorId}`);
  // }

  static async create(payload: { phone_number: string; name: string }): Promise<any> {
    return await apiService.$post("/customer", payload);
  }

  // static async update(payload: UpdateColorPayload): Promise<Color> {
  //   const { color_id, ...data } = payload;
  //   return await apiService.$put<Color>(`/admin/color?color_id=${color_id}`, data);
  // }
}
