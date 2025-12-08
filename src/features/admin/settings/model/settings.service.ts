import { apiService } from "@/shared/lib/services/ApiService";
import { Company, UpdateCompanyPayload, UpdateConfigurationPayload, AppConfiguration } from "./model.types";

export class SettingsService {
  // Company methods
  static async getCompany(): Promise<Company> {
    return await apiService.$get<Company>("/company");
  }

  static async updateCompany(payload: UpdateCompanyPayload): Promise<Company> {
    return await apiService.$patch<Company>("/admin/company", payload);
  }

  // Configuration methods
  static async getConfiguration(): Promise<AppConfiguration> {
    return await apiService.$get<AppConfiguration>("/configuration");
  }

  static async updateConfiguration(payload: UpdateConfigurationPayload): Promise<AppConfiguration> {
    return await apiService.$patch<AppConfiguration>("/admin/configuration", payload);
  }
}
