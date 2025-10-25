import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { ConfigurationState } from "@/shared/types/configuration";
import { configurationService } from "@/shared/lib/services/ConfigurationService";

interface ConfigurationContextType extends ConfigurationState {
  refetchConfiguration: () => Promise<void>;
  getStaticAssetsBaseUrl: () => string;
  getHostingDomain: () => string;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

interface ConfigurationProviderProps {
  children: ReactNode;
}

export function ConfigurationProvider({
  children,
}: ConfigurationProviderProps) {
  const [state, setState] = useState<ConfigurationState>({
    config: null,
    isLoading: true,
    error: null,
  });

  const isFetchingRef = useRef(false);

  const fetchConfiguration = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      return;
    }

    // Check if we already have config in memory
    const existingConfig = configurationService.getConfiguration();
    if (existingConfig) {
      setState({ config: existingConfig, isLoading: false, error: null });
      return;
    }

    isFetchingRef.current = true;
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const config = await configurationService.fetchConfiguration();
      setState({ config, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch configuration",
      }));
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const getStaticAssetsBaseUrl = () => {
    if (state.config?.hosting_domain) {
      return state.config.hosting_domain;
    }
    return "https://ozbegim.jaspercrm.uz"; // fallback
  };

  const getHostingDomain = () => {
    if (state.config?.hosting_domain) {
      return state.config.hosting_domain;
    }
    return ""; // fallback
  };

  const value: ConfigurationContextType = {
    ...state,
    refetchConfiguration: fetchConfiguration,
    getStaticAssetsBaseUrl,
    getHostingDomain,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider",
    );
  }
  return context;
}
