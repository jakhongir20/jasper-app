import { authApiService } from "@/shared/lib/services/ApiService";
import { User, UpdateUserPayload } from "@/features/admin/users/model/model.types";

export class ProfileService {
    static async getCurrentUser(): Promise<User> {
        return await authApiService.$get<User>("/me");
    }

    static async updateProfile(payload: UpdateUserPayload): Promise<User> {
        return await authApiService.$put<User>("/me", payload);
    }
}
