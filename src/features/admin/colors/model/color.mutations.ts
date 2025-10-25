import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColorService } from "./color.service";
import { CreateColorPayload, UpdateColorPayload } from "./model.types";

export const useCreateColor = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateColorPayload) => ColorService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateColor = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateColorPayload) => ColorService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
