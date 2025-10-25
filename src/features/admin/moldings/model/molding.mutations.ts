import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { MoldingService } from "./molding.service";
import {
  CreateMoldingPayload,
  UpdateMoldingPayload,
  Molding,
} from "./model.types";

export function useCreateMolding(
  options?: UseMutationOptions<Molding, unknown, CreateMoldingPayload>,
) {
  const mutationFn: MutationFunction<Molding, CreateMoldingPayload> = async (
    payload,
  ) => await MoldingService.create(payload);

  return useMutation<Molding, unknown, CreateMoldingPayload>({
    mutationKey: ["createMolding"],
    mutationFn,
    ...options,
  });
}

export function useUpdateMolding(
  options?: UseMutationOptions<
    Molding,
    unknown,
    { moldingId: number; payload: UpdateMoldingPayload }
  >,
) {
  const mutationFn: MutationFunction<
    Molding,
    { moldingId: number; payload: UpdateMoldingPayload }
  > = async ({ moldingId, payload }) =>
    await MoldingService.update(moldingId, payload);

  return useMutation<
    Molding,
    unknown,
    { moldingId: number; payload: UpdateMoldingPayload }
  >({
    mutationKey: ["updateMolding"],
    mutationFn,
    ...options,
  });
}

export function useDeleteMolding(
  options?: UseMutationOptions<void, unknown, number>,
) {
  const mutationFn: MutationFunction<void, number> = async (moldingId) =>
    await MoldingService.delete(moldingId);

  return useMutation<void, unknown, number>({
    mutationKey: ["deleteMolding"],
    mutationFn,
    ...options,
  });
}
