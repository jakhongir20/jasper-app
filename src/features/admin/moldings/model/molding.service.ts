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
    return await ApiService.$get<Molding>(`/admin/framework?framework_id=${moldingId}`);
  }

  static async create(payload: CreateMoldingPayload): Promise<Molding> {
    return await ApiService.$post<Molding>("/admin/framework", payload);
  }

  static async update(
    moldingId: number,
    payload: UpdateMoldingPayload,
  ): Promise<Molding> {
    return await ApiService.$patch<Molding>(
      `/admin/framework?framework_id=${moldingId}`,
      payload,
    );
  }

  static async delete(moldingId: number): Promise<void> {
    return await ApiService.$delete(`/admin/framework?framework_id=${moldingId}`);
  }
}
