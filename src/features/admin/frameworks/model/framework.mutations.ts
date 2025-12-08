import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { FrameworkService } from "./framework.service";
import {
  CreateFrameworkPayload,
  UpdateFrameworkPayload,
  Framework,
} from "./model.types";

export function useCreateFramework(
  options?: UseMutationOptions<Framework, unknown, CreateFrameworkPayload>,
) {
  const mutationFn: MutationFunction<Framework, CreateFrameworkPayload> = async (
    payload,
  ) => await FrameworkService.create(payload);

  return useMutation<Framework, unknown, CreateFrameworkPayload>({
    mutationKey: ["createFramework"],
    mutationFn,
    ...options,
  });
}

export function useUpdateFramework(
  options?: UseMutationOptions<
    Framework,
    unknown,
    { frameworkId: number; payload: UpdateFrameworkPayload }
  >,
) {
  const mutationFn: MutationFunction<
    Framework,
    { frameworkId: number; payload: UpdateFrameworkPayload }
  > = async ({ frameworkId, payload }) =>
    await FrameworkService.update(frameworkId, payload);

  return useMutation<
    Framework,
    unknown,
    { frameworkId: number; payload: UpdateFrameworkPayload }
  >({
    mutationKey: ["updateFramework"],
    mutationFn,
    ...options,
  });
}

export function useDeleteFramework(
  options?: UseMutationOptions<void, unknown, number>,
) {
  const mutationFn: MutationFunction<void, number> = async (frameworkId) =>
    await FrameworkService.delete(frameworkId);

  return useMutation<void, unknown, number>({
    mutationKey: ["deleteFramework"],
    mutationFn,
    ...options,
  });
}

// Backward compatibility aliases
export const useCreateMolding = useCreateFramework;
export const useUpdateMolding = useUpdateFramework;
export const useDeleteMolding = useDeleteFramework;
