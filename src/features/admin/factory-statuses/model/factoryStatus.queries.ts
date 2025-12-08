import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FactoryStatusService } from "./factoryStatus.service";
import { FactoryStatus } from "./model.types";

export function useFactoryStatusDetail(factoryStatusId: number): UseQueryResult<FactoryStatus> {
  return useQuery<FactoryStatus>({
    queryKey: ["factory-status-detail", factoryStatusId],
    queryFn: () => FactoryStatusService.getById(factoryStatusId),
    enabled: !!factoryStatusId,
  });
}
