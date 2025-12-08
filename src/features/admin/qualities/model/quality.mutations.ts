import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QualityService } from "./quality.service";
import { CreateQualityPayload, UpdateQualityPayload } from "./model.types";

export const useCreateQuality = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQualityPayload) => QualityService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualities"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateQuality = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQualityPayload) => QualityService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualities"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteQuality = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qualityId: number) => QualityService.delete(qualityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualities"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
