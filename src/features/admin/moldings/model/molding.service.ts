import {
  Molding,
  CreateMoldingPayload,
  UpdateMoldingPayload,
} from "./model.types";
import { ApiService } from "@/shared/lib/services";

export class MoldingService {
  static async getAll(): Promise<Molding[]> {
    return await ApiService.$get<Molding[]>("/admin/framework/all");
  }

  static async getById(moldingId: number): Promise<Molding> {
    return await ApiService.$get<Molding>(`/molding?molding_id=${moldingId}`);
  }

  static async create(payload: CreateMoldingPayload): Promise<Molding> {
    return await ApiService.$post<Molding>("/admin/molding", payload);
  }

  static async update(
    moldingId: number,
    payload: UpdateMoldingPayload,
  ): Promise<Molding> {
    return await ApiService.$put<Molding>(
      `/admin/molding?molding_id=${moldingId}`,
      payload,
    );
  }

  static async delete(moldingId: number): Promise<void> {
    return await ApiService.$delete(`/admin/molding?molding_id=${moldingId}`);
  }
}
