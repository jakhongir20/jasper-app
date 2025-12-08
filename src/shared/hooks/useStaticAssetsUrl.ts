export function useStaticAssetsUrl() {
  const baseUrl = import.meta.env.VITE_STATIC_ASSETS_BASE_URL as string;

  const getAssetUrl = (path: string): string => {
    if (!path) return "";

    // Remove leading slash if present
    let cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // Remove /uat/ prefix if present
    if (cleanPath.startsWith("uat/")) {
      cleanPath = cleanPath.slice(4); // Remove "uat/"
    }

    return `${baseUrl}/${cleanPath}`;
  };

  return {
    getAssetUrl,
    baseUrl,
    isLoading: false,
  };
}
