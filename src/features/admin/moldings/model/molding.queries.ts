import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { MoldingService } from "./molding.service";
import { Molding } from "./model.types";

export function useMoldingDetail(moldingId: number): UseQueryResult<Molding> {
  return useQuery<Molding>({
    queryKey: ["molding-detail", moldingId],
    queryFn: () => MoldingService.getById(moldingId),
    enabled: !!moldingId,
  });
}

// Note: useMoldingsList is no longer used - we use useTableFetch instead
// export function useMoldingsList(): UseQueryResult<Molding[]> {
//   return useQuery<Molding[]>({
//     queryKey: ["moldings-list"],
//     queryFn: () => MoldingService.getAll(),
//   });
// }
