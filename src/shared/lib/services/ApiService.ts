import { AxiosRequestConfig } from "axios";

import { ApiSetupService } from "@/shared/lib/services/ApiSetupService";

class ApiService extends ApiSetupService {
  constructor(baseURL?: string) {
    super(baseURL);
  }

  public async $get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async $post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async $put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async $patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async $delete<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, {
      data,
      ...config,
    });
    return response.data;
  }
}

// Default: gateway API
export const apiService = new ApiService();

// Auth/profile API (no gateway)
export const authApiService = new ApiService(
  import.meta.env.VITE_API_AUTH_URL as string,
);
