import { apiService } from "@/shared/lib/services/ApiService";
import { Branch, CreateBranchPayload, UpdateBranchPayload } from "./model.types";

interface BranchPageResponse {
  results: Branch[];
  pagination: {
    total_count: number;
    limit: number;
    offset: number;
  };
}

export class BranchService {
  static async getAll(): Promise<BranchPageResponse> {
    return await apiService.$get<BranchPageResponse>("/admin/branch/all");
  }

  static async getById(branchId: number): Promise<Branch> {
    return await apiService.$get<Branch>(`/admin/branch?branch_id=${branchId}`);
  }

  static async create(payload: CreateBranchPayload): Promise<Branch> {
    return await apiService.$post<Branch>("/admin/branch", payload);
  }

  static async update(payload: UpdateBranchPayload): Promise<Branch> {
    const { branch_id, ...data } = payload;
    return await apiService.$patch<Branch>("/admin/branch", { branch_id, ...data });
  }

  static async delete(branchId: number): Promise<void> {
    return await apiService.$delete("/admin/branch", { branch_id: branchId });
  }
}
