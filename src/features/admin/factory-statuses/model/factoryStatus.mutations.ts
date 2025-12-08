import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FactoryStatusService } from "./factoryStatus.service";
import { CreateFactoryStatusPayload, UpdateFactoryStatusPayload } from "./model.types";

export const useCreateFactoryStatus = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFactoryStatusPayload) => FactoryStatusService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factoryStatuses"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateFactoryStatus = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFactoryStatusPayload) => FactoryStatusService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factoryStatuses"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteFactoryStatus = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (factoryStatusId: number) => FactoryStatusService.delete(factoryStatusId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factoryStatuses"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
