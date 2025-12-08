import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { SettingsService } from "./settings.service";
import { Company, AppConfiguration } from "./model.types";

export function useCompanyDetail(): UseQueryResult<Company> {
  return useQuery<Company>({
    queryKey: ["company-detail"],
    queryFn: () => SettingsService.getCompany(),
  });
}

export function useConfigurationDetail(): UseQueryResult<AppConfiguration> {
  return useQuery<AppConfiguration>({
    queryKey: ["configuration-detail"],
    queryFn: () => SettingsService.getConfiguration(),
  });
}
