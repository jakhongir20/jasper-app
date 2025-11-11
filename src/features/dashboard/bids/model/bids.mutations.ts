import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { BidsService } from "@/features/dashboard/bids/model/bids.service";
import { ApplicationDetail } from "@/features/dashboard/bids/details";

export function useDeleteApplication(
  options?: UseMutationOptions<unknown, unknown, string>,
) {
  const mutationFn: MutationFunction<unknown, string> = async (guid: string) =>
    await BidsService.delete(guid);

  return useMutation({
    mutationKey: ["deleteApplication"],
    mutationFn,
    ...options,
  });
}

export function useCreateApplication(
  options?: UseMutationOptions<unknown, unknown, unknown>,
) {
  const mutationFn: MutationFunction<unknown, unknown> = async (formData) =>
    await BidsService.create(formData);

  return useMutation<unknown, unknown, unknown>({
    mutationKey: ["createApplication"],
    mutationFn,
    ...options,
  });
}

export function useUpdateApplication(
  options?: UseMutationOptions<
    unknown,
    unknown,
    { id: string; formData: unknown }
  >,
) {
  const mutationFn: MutationFunction<
    unknown,
    { id: string; formData: unknown }
  > = async ({ id, formData }) => await BidsService.update(id, formData);

  return useMutation<unknown, unknown, { id: string; formData: unknown }>({
    mutationKey: ["updateApplication"],
    mutationFn,
    ...options,
  });
}

export function useForecastApplication(
  options?: UseMutationOptions<
    ApplicationDetail,
    unknown,
    { id: string; formData: unknown }
  >,
) {
  const mutationFn: MutationFunction<
    ApplicationDetail,
    { id: string; formData: unknown }
  > = async ({ id, formData }) => await BidsService.forecast(id, formData);

  return useMutation<
    ApplicationDetail,
    unknown,
    { id: string; formData: unknown }
  >({
    mutationKey: ["forecastApplication"],
    mutationFn,
    ...options,
  });
}

export function useServiceForecast(
  options?: UseMutationOptions<
    {
      payload: any;
      results: {
        services: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          service_id: number;
          quantity: number;
        }>;
        additionalServices?: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          quality_id: number;
          quantity: number;
        }>;
      };
    },
    unknown,
    number | string
  >,
) {
  const mutationFn: MutationFunction<
    {
      payload: any;
      results: {
        services: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          service_id: number;
          quantity: number;
        }>;
        additionalServices?: Array<{
          name: string;
          features: string | null;
          price_uzs: number;
          price_usd: number;
          measure: string | null;
          quality_id: number;
          quantity: number;
        }>;
      };
    },
    number | string
  > = async (applicationId) =>
    await BidsService.forecastServices(applicationId);

  return useMutation({
    mutationKey: ["serviceForecast"],
    mutationFn,
    ...options,
  });
}
