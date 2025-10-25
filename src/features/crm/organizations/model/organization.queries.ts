import { useQuery } from "@tanstack/react-query";

export const useOrganizationDetail = (guid: string) => {
  return useQuery({
    queryKey: ["organization", guid],
    queryFn: () => Promise.resolve(null), // TODO: Implement actual API call
    enabled: !!guid,
  });
};

