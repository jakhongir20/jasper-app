import { configurationService } from "@/shared/lib/services/ConfigurationService";

// This will be dynamically set based on configuration
export const getStaticAssetsBaseUrl = () => {
  return configurationService.getStaticAssetsBaseUrl();
};

// Fallback for cases where configuration is not available
export const STATIC_ASSETS_BASE_URL = "https://ozbegim.jaspercrm.uz";
