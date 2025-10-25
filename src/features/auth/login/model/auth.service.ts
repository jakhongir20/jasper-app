import {
  LoginFormData,
  LoginResponse,
  User,
} from "@/features/auth/login/model";
import { authApiService } from "@/shared/lib/services/ApiService";

export class AuthService {
  static async login(loginData: LoginFormData): Promise<LoginResponse> {
    return await authApiService.$post<LoginResponse>("/authorize", loginData);
  }

  static getProfile() {
    return authApiService.$get<User>("/me");
  }
}
