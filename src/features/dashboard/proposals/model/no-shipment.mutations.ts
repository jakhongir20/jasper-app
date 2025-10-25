import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { PWDService } from "@/features/purchase/no-ship/model";
import { PurchaseWithoutDelivery } from "@/features/purchase/no-ship/model/no-shipment.types";
import { Stage } from "@/features/purchase/order";

export function useDelete(
  options?: UseMutationOptions<unknown, unknown, string>,
) {
  const mutationFn: MutationFunction<unknown, string> = async (guid: string) =>
    await PWDService.delete(guid);

  return useMutation({
    mutationKey: ["deletePWD"],
    mutationFn,
    ...options,
  });
}

export function useCreate(
  options?: UseMutationOptions<
    PurchaseWithoutDelivery,
    unknown,
    PurchaseWithoutDelivery
  >,
) {
  const mutationFn: MutationFunction<
    PurchaseWithoutDelivery,
    PurchaseWithoutDelivery
  > = async (formData: PurchaseWithoutDelivery) =>
    await PWDService.create(formData);

  return useMutation<PurchaseWithoutDelivery, unknown, PurchaseWithoutDelivery>(
    {
      mutationKey: ["createPWD"],
      mutationFn,
      ...options,
    },
  );
}

export function useUpdate(
  options?: UseMutationOptions<
    PurchaseWithoutDelivery,
    unknown,
    { guid: string; formData: PurchaseWithoutDelivery }
  >,
) {
  const mutationFn: MutationFunction<
    PurchaseWithoutDelivery,
    { guid: string; formData: PurchaseWithoutDelivery }
  > = async ({ guid, formData }) => await PWDService.update(formData, guid);

  return useMutation<
    PurchaseWithoutDelivery,
    unknown,
    { guid: string; formData: PurchaseWithoutDelivery }
  >({
    mutationKey: ["updatePWD"],
    mutationFn,
    ...options,
  });
}

export function useCreateCargoStage(
  options?: UseMutationOptions<Stage, unknown, string>,
) {
  const mutationFn: MutationFunction<Stage, string> = async (
    formData: string,
  ) => await PWDService.createCargoStage(formData);

  return useMutation<Stage, unknown, string>({
    mutationKey: ["create-cargo-stage"],
    mutationFn,
    ...options,
  });
}
