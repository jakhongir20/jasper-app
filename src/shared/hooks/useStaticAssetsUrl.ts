export function useStaticAssetsUrl() {
  const baseUrl = import.meta.env.VITE_STATIC_ASSETS_BASE_URL as string || "https://ozbegim.jaspercrm.uz";

  const getAssetUrl = (path: string): string => {
    if (!path) return "";

    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${baseUrl}/${cleanPath}`;
  };

  return {
    getAssetUrl,
    baseUrl,
    isLoading: false,
  };
}
