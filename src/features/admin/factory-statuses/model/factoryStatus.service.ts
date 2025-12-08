import { apiService } from "@/shared/lib/services/ApiService";
import { FactoryStatus, CreateFactoryStatusPayload, UpdateFactoryStatusPayload } from "./model.types";

export class FactoryStatusService {
  static async getAll(): Promise<FactoryStatus[]> {
    return await apiService.$post<FactoryStatus[]>("/admin/factory-status/all", {});
  }

  static async getById(factoryStatusId: number): Promise<FactoryStatus> {
    return await apiService.$get<FactoryStatus>(`/admin/factory-status?factory_status_id=${factoryStatusId}`);
  }

  static async create(payload: CreateFactoryStatusPayload): Promise<FactoryStatus> {
    return await apiService.$post<FactoryStatus>("/admin/factory-status", payload);
  }

  static async update(payload: UpdateFactoryStatusPayload): Promise<FactoryStatus> {
    const { factory_status_id, ...data } = payload;
    return await apiService.$patch<FactoryStatus>(`/admin/factory-status?factory_status_id=${factory_status_id}`, data);
  }

  static async delete(factoryStatusId: number): Promise<void> {
    return await apiService.$delete(`/admin/factory-status?factory_status_id=${factoryStatusId}`);
  }
}
