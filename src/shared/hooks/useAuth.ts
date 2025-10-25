import { useEffect, useState } from "react";
import { getCookie } from "@/shared/lib/services";
import eventBus from "@/shared/utils/eventBus";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("__token") || localStorage.getItem("__token");
      setIsAuthenticated(!!token);
    };

    // Check initially
    checkAuth();

    // Listen for unauthorized events (logout)
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = () => {
      checkAuth();
    };

    eventBus.on("unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      eventBus.off("unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isAuthenticated };
}
