import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { CommonService } from "@/shared/model/common.service";

type DeleteParams = {
  url: string;
  params: { id: string | number; key: string };
};

export function useDelete(
  options?: UseMutationOptions<unknown, unknown, DeleteParams>,
) {
  const mutationFn: MutationFunction<unknown, DeleteParams> = (params) =>
    CommonService.deleteRecord(params);

  return useMutation({
    mutationKey: ["commonDelete"],
    mutationFn,
    ...options,
  });
}
