import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ApiService, getCookie } from "@/shared/lib/services";
import i18n from "i18next";
import { ErrorResponse } from "react-router-dom";

export function useDownloadCSV(endpoint: string) {
  const { t } = useTranslation();
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);

  function downloadFile(fileNameKey: string, fullUrl?: string) {
    setIsDownloadingFile(true);
    const token = getCookie("__token");
    const locale = i18n.language || "ru";

    const subdomain = ApiService.getSubdomain();
    const baseURL = subdomain
      ? `https://${subdomain}.wave-stable.uz/api/`
      : (import.meta.env.VITE_API_URL as string);

    const url = fullUrl ? `${baseURL}${fullUrl}` : `${baseURL}${endpoint}`;

    fetch(url, {
      headers: new Headers({
        Authorization: token ? `Bearer ${token}` : "",
        "Accept-Language": locale,
      }),
    })
      .then((res) => res.blob())
      .then((res) => {
        const blobUrl = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", t(fileNameKey || "file") + ".xlsx");
        link.click();
        link.remove();
      })
      .catch((error: ErrorResponse) => {})
      .finally(() => {
        setIsDownloadingFile(false);
      });
  }

  return {
    isDownloadingFile,
    downloadFile,
  };
}
