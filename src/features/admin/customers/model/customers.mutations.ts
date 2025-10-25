import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  UpdateColorPayload } from "@/features/admin/colors";
import { CustomersService } from "@/features/admin/customers/model/customers.service";

export const useCreateCustomer = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateColorPayload) => CustomersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
