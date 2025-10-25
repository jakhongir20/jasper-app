import { configurationService } from "@/shared/lib/services/ConfigurationService";

/**
 * Get the static assets base URL for use in non-React contexts (like HTML templates)
 * This function can be called from anywhere in the application
 */
export const getStaticAssetsBaseUrl = (): string => {
  return configurationService.getStaticAssetsBaseUrl();
};

/**
 * Get the hosting domain for use in non-React contexts
 */
export const getHostingDomain = (): string => {
  return configurationService.getHostingDomain();
};

/**
 * Get a complete asset URL for use in non-React contexts
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return "";

  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${getStaticAssetsBaseUrl()}/${cleanPath}`;
};
