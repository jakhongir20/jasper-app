import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { QualityService } from "./quality.service";
import { Quality } from "./model.types";

export function useQualityDetail(qualityId: number): UseQueryResult<Quality> {
  return useQuery<Quality>({
    queryKey: ["quality-detail", qualityId],
    queryFn: () => QualityService.getById(qualityId),
    enabled: !!qualityId,
  });
}
