import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { showGlobalToast } from "@/shared/hooks";
import { formatValidationErrorsForDisplay } from "@/shared/utils";

interface ValidationErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: string;
}

interface CustomError extends Error {
  response?: {
    data?: {
      detail?: string[] | ValidationErrorDetail[];
    };
    status?: number;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ⬇️ отключаем автоматические перезапросы
      // refetchOnWindowFocus: false, // при фокусе окна
      // refetchOnReconnect: false, // при восстановлении сети
      // refetchOnMount: false, // при повторном маунте (возврат на страницу)

      // ⬇️ делаем данные «вечнозелёными»
      // staleTime: Infinity, // пока не вызовете refetch() вручную
      // cacheTime: 5 * 60 * 1000, // (по желанию) 5 мин хранить в памяти
      retry: 1, // Retry failed queries only once
      // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Exponential backoff up to 3s
    },
    mutations: {
      retry: 1, // Retry failed mutations only once
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      globalErrorHandler(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      if (typeof mutation.options.onError === "function") {
        return;
      }

      globalErrorHandler(error);
    },
  }),
});

export function globalErrorHandler(error: unknown) {
  if (error instanceof Error) {
    const customError = error as CustomError;
    const details = customError?.response?.data?.detail;
    const statusCode = customError?.response?.status;

    // Handle 422 validation errors with complex detail structure
    if (statusCode === 422 && details && Array.isArray(details)) {
      const formattedErrors = formatValidationErrorsForDisplay(error);
      formattedErrors.forEach((errorMsg) => {
        showGlobalToast(errorMsg, "error");
      });
    } else if (details && Array.isArray(details)) {
      // Handle simple string arrays (existing logic)
      details.forEach((detail) => {
        if (typeof detail === "string") {
          showGlobalToast(detail, "error");
        }
      });
    } else {
      showGlobalToast(details || error.message, "error");
    }
  } else {
    showGlobalToast("An unknown error occurred", "error");
  }
}
