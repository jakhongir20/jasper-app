import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@/shared/lib/services/cookieConf";
import eventBus from "@/shared/utils/eventBus";
import axios, { AxiosError, AxiosHeaders, AxiosInstance } from "axios";
import i18n from "i18next";

export class ApiSetupService {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    const url = baseURL || (import.meta.env.VITE_API_BASE_URL as string);

    this.axiosInstance = axios.create({
      baseURL: url,
    });

    this.setupInterceptors();
  }

  public deleteCredentials() {
    eventBus.emit("unauthorized");
    deleteCookie("__token");
    deleteCookie("__user");
    // Also clear localStorage tokens
    localStorage.removeItem("__token");
    localStorage.removeItem("__user");
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        let token = getCookie("__token");
        const language = i18n.language || "ru";

        // If no token in cookie, try to get it from localStorage
        if (!token) {
          const localStorageToken = localStorage.getItem("__token");
          // If found in localStorage, sync it to cookie
          if (localStorageToken) {
            token = localStorageToken;
            setCookie("__token", localStorageToken, { maxAge: 24 * 60 * 60 }); // 1 day default
          }
        }

        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers["Accept-Language"] = language;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const statusCode = error.response?.status;

        if ([500].includes(statusCode!)) {
          // eventBus.emit("catch500");
          return Promise.reject(error);
        }
        if ([404].includes(statusCode!)) {
          // eventBus.emit("catch404");
          return Promise.reject(error);
        }

        if ([401, 403].includes(statusCode!)) {
          // Check if this is a login request - don't auto-refresh for login endpoints
          const isLoginRequest = error.config?.url?.includes("/auth/login");

          if (!isLoginRequest) {
            // For now, just delete credentials on 401/403 errors
            // Token refresh logic can be implemented later if needed
            this.deleteCredentials();
          }

          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }
}
