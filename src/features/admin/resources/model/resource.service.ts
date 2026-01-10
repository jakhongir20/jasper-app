import { apiService } from "@/shared/lib/services/ApiService";
import { Resource, CreateResourcePayload, UpdateResourcePayload } from "./model.types";

interface ResourcePageResponse {
  results: Resource[];
  pagination: {
    total_count: number;
    limit: number;
    offset: number;
  };
}

export class ResourceService {
  static async getAll(): Promise<ResourcePageResponse> {
    return await apiService.$get<ResourcePageResponse>("/admin/resource/all");
  }

  static async getById(resourceId: number): Promise<Resource> {
    return await apiService.$get<Resource>(`/admin/resource?resource_id=${resourceId}`);
  }

  static async create(payload: CreateResourcePayload): Promise<Resource> {
    return await apiService.$post<Resource>("/admin/resource", payload);
  }

  static async update(payload: UpdateResourcePayload): Promise<Resource> {
    const { resource_id, ...data } = payload;
    return await apiService.$patch<Resource>(`/admin/resource?resource_id=${resource_id}`, data);
  }

  static async delete(resourceId: number): Promise<void> {
    return await apiService.$delete(`/admin/resource?resource_id=${resourceId}`);
  }
}
