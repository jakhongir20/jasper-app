import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceService } from "./service.service";
import { CreateServicePayload, UpdateServicePayload } from "./model.types";

export const useCreateService = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => ServiceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateService = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateServicePayload) => ServiceService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteService = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: number) => ServiceService.delete(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
