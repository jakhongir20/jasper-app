import { useConfiguration } from "@/shared/contexts/ConfigurationContext";

export function useStaticAssetsUrl() {
  const { getStaticAssetsBaseUrl, isLoading } = useConfiguration();

  const getAssetUrl = (path: string): string => {
    if (!path) return "";

    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${getStaticAssetsBaseUrl()}/${cleanPath}`;
  };

  return {
    getAssetUrl,
    baseUrl: getStaticAssetsBaseUrl(),
    isLoading,
  };
}
