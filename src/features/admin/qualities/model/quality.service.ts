import { apiService } from "@/shared/lib/services/ApiService";
import { Quality, CreateQualityPayload, UpdateQualityPayload } from "./model.types";

export class QualityService {
  static async getAll(): Promise<Quality[]> {
    return await apiService.$post<Quality[]>("/admin/quality/all", {});
  }

  static async getById(qualityId: number): Promise<Quality> {
    return await apiService.$get<Quality>(`/admin/quality?quality_id=${qualityId}`);
  }

  static async create(payload: CreateQualityPayload): Promise<Quality> {
    return await apiService.$post<Quality>("/admin/quality", payload);
  }

  static async update(payload: UpdateQualityPayload): Promise<Quality> {
    const { quality_id, ...data } = payload;
    return await apiService.$patch<Quality>(`/admin/quality?quality_id=${quality_id}`, data);
  }

  static async delete(qualityId: number): Promise<void> {
    return await apiService.$delete(`/admin/quality?quality_id=${qualityId}`);
  }
}
