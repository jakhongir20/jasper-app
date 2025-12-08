import {
  Framework,
  CreateFrameworkPayload,
  UpdateFrameworkPayload,
} from "./model.types";
import { ApiService } from "@/shared/lib/services";

export class FrameworkService {
  static async getAll(): Promise<Framework[]> {
    return await ApiService.$get<Framework[]>("/admin/framework/all");
  }

  static async getById(frameworkId: number): Promise<Framework> {
    return await ApiService.$get<Framework>(`/admin/framework?framework_id=${frameworkId}`);
  }

  static async create(payload: CreateFrameworkPayload): Promise<Framework> {
    return await ApiService.$post<Framework>("/admin/framework", payload);
  }

  static async update(
    frameworkId: number,
    payload: UpdateFrameworkPayload,
  ): Promise<Framework> {
    return await ApiService.$patch<Framework>(
      `/admin/framework?framework_id=${frameworkId}`,
      payload,
    );
  }

  static async delete(frameworkId: number): Promise<void> {
    return await ApiService.$delete(`/admin/framework?framework_id=${frameworkId}`);
  }
}

// Backward compatibility alias
export const MoldingService = FrameworkService;
