import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Locale } from "antd/es/locale";
import en_US from "antd/lib/locale/en_US";
import ru_RU from "antd/lib/locale/ru_RU";
import uz_UZ from "antd/lib/locale/uz_UZ";
import { ReactNode } from "react";

import i18n from "@/app/i18n";
import { GlobalToastConfig } from "@/app/providers/GlobalToastConfig";
import { antdThemeConfig } from "@/app/style/antdThemeConfig";
import { queryClient } from "@/shared/lib/react-query";
import { ConfigurationProvider } from "@/shared/contexts/ConfigurationContext";

import MessageProvider from "./MessageProvider";

interface Props {
  children: ReactNode;
}

// NOTE: ALL providers must be implemented in this appEntry instance
export function Providers({ children }: Props) {
  const currentLocale = i18n.language;
  const locales: Record<string, Locale> = {
    ru: ru_RU,
    en: en_US,
    uz: uz_UZ,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigurationProvider>
        <MessageProvider>
          <ConfigProvider
            locale={locales[currentLocale]}
            theme={antdThemeConfig}
            form={{
              validateMessages: {
                required: "",
              },
              requiredMark: false,
            }}
          >
            <GlobalToastConfig>{children}</GlobalToastConfig>
          </ConfigProvider>
        </MessageProvider>
      </ConfigurationProvider>
    </QueryClientProvider>
  );
}
