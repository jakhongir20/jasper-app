import { apiService } from "./ApiService";
import { AppConfiguration } from "@/shared/types/configuration";

class ConfigurationService {
  private static instance: ConfigurationService;
  private config: AppConfiguration | null = null;
  private readonly STORAGE_KEY = "app_configuration";
  private fetchPromise: Promise<AppConfiguration> | null = null;

  private constructor() {}

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  public async fetchConfiguration(): Promise<AppConfiguration> {
    // Return existing promise if already fetching
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = this._doFetchConfiguration();

    try {
      const result = await this.fetchPromise;
      return result;
    } finally {
      this.fetchPromise = null;
    }
  }

  private async _doFetchConfiguration(): Promise<AppConfiguration> {
    try {
      // Fetch from API
      const response =
        await apiService.$get<AppConfiguration>("/configuration");

      // Store in memory and localStorage
      this.config = response;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));

      return response;
    } catch (error) {
      // Try to load from localStorage as fallback
      const storedConfig = this.getStoredConfiguration();
      if (storedConfig) {
        this.config = storedConfig;
        return storedConfig;
      }

      throw error;
    }
  }

  public getConfiguration(): AppConfiguration | null {
    if (!this.config) {
      this.config = this.getStoredConfiguration();
    }
    return this.config;
  }

  public getHostingDomain(): string {
    const config = this.getConfiguration();
    return config?.hosting_domain || "";
  }

  public getStaticAssetsBaseUrl(): string {
    const hostingDomain = this.getHostingDomain();
    return hostingDomain || "https://ozbegim.jaspercrm.uz";
  }

  private getStoredConfiguration(): AppConfiguration | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  public clearConfiguration(): void {
    this.config = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const configurationService = ConfigurationService.getInstance();
