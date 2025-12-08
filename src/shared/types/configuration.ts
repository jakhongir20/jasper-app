export interface AppConfiguration {
  usd_rate: number;
  company_name: string;
  hosting_domain: string;
  molding_coefficient: number;
  standard_box_width: number;
}

export interface ConfigurationState {
  config: AppConfiguration | null;
  isLoading: boolean;
  error: string | null;
}
