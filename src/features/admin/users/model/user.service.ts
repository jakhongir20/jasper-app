import { authApiService } from "@/shared/lib/services/ApiService";
import { User, CreateUserPayload, UpdateUserPayload } from "./model.types";

export class UserService {
  static async getAll(): Promise<User[]> {
    return await authApiService.$get<User[]>("/");
  }

  static async getById(userId: number): Promise<User> {
    return await authApiService.$get<User>(`/admin/?user_id=${userId}`);
  }

  static async create(payload: CreateUserPayload): Promise<User> {
    return await authApiService.$post<User>("/admin/", payload);
  }

  static async update(userId: number, payload: UpdateUserPayload): Promise<User> {
    return await authApiService.$patch<User>(`/admin?user_id=${userId}`, payload);
  }

  static async delete(userId: number): Promise<void> {
    return await authApiService.$delete(`/admin/?user_id=${userId}`);
  }
} 