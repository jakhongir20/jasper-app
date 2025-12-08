import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FrameworkService } from "./framework.service";
import { Framework } from "./model.types";

export function useFrameworkDetail(frameworkId: number): UseQueryResult<Framework> {
  return useQuery<Framework>({
    queryKey: ["framework-detail", frameworkId],
    queryFn: () => FrameworkService.getById(frameworkId),
    enabled: !!frameworkId,
  });
}

// Backward compatibility alias
export const useMoldingDetail = useFrameworkDetail;

// Note: useFrameworksList is no longer used - we use useTableFetch instead
// export function useFrameworksList(): UseQueryResult<Framework[]> {
//   return useQuery<Framework[]>({
//     queryKey: ["frameworks-list"],
//     queryFn: () => FrameworkService.getAll(),
//   });
// }
