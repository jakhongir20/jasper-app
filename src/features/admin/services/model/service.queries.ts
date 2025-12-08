import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ServiceService } from "./service.service";
import { Service } from "./model.types";

export function useServiceDetail(serviceId: number): UseQueryResult<Service> {
  return useQuery<Service>({
    queryKey: ["service-detail", serviceId],
    queryFn: () => ServiceService.getById(serviceId),
    enabled: !!serviceId,
  });
}
