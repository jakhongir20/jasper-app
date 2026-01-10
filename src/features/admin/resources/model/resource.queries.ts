import { useQuery } from "@tanstack/react-query";
import { ResourceService } from "./resource.service";

export const useResources = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => ResourceService.getAll(),
  });
};

export const useResource = (resourceId: number) => {
  return useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => ResourceService.getById(resourceId),
    enabled: resourceId > 0,
  });
};
