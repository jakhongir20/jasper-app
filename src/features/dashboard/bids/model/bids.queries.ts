import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { BidsService } from "@/features/dashboard/bids/model";
import { ApplicationDetail } from "@/features/dashboard/bids/details";

export function useApplicationDetail(
  id: string,
): UseQueryResult<ApplicationDetail> {
  return useQuery<ApplicationDetail>({
    queryKey: ["application-detail", id],
    queryFn: () => BidsService.getDetail(id),
  });
}
