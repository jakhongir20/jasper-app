import { apiService } from "@/shared/lib/services/ApiService";
import { Service, CreateServicePayload, UpdateServicePayload } from "./model.types";

export class ServiceService {
  static async getAll(): Promise<Service[]> {
    return await apiService.$get<Service[]>("/admin/service/all");
  }

  static async getById(serviceId: number): Promise<Service> {
    return await apiService.$get<Service>(`/admin/service?service_id=${serviceId}`);
  }

  static async create(payload: CreateServicePayload): Promise<Service> {
    return await apiService.$post<Service>("/admin/service", payload);
  }

  static async update(payload: UpdateServicePayload): Promise<Service> {
    const { service_id, ...data } = payload;
    return await apiService.$patch<Service>(`/admin/service?service_id=${service_id}`, data);
  }

  static async delete(serviceId: number): Promise<void> {
    return await apiService.$delete(`/admin/service?service_id=${serviceId}`);
  }
}
