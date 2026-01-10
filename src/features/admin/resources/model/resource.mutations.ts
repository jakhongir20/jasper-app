import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResourceService } from "./resource.service";
import { CreateResourcePayload, UpdateResourcePayload } from "./model.types";

export const useCreateResource = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResourcePayload) => ResourceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateResource = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateResourcePayload) => ResourceService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteResource = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) => ResourceService.delete(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
