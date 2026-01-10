import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "./branch.service";
import { CreateBranchPayload, UpdateBranchPayload } from "./model.types";

export const useCreateBranch = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchPayload) => BranchService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateBranch = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBranchPayload) => BranchService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteBranch = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: number) => BranchService.delete(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
