import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "./settings.service";
import { Company, UpdateCompanyPayload, UpdateConfigurationPayload, AppConfiguration } from "./model.types";

export const useUpdateCompany = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => SettingsService.updateCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-detail"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateConfiguration = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConfigurationPayload) => SettingsService.updateConfiguration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-detail"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
