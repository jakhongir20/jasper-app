import { AppConfiguration } from "@/shared/types/configuration";

export interface Company {
  company_id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: number;
}

export interface UpdateCompanyPayload {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateConfigurationPayload {
  usd_rate?: number;
  company_name?: string;
  hosting_domain?: string;
  molding_coefficient?: number;
}

// Re-export AppConfiguration for convenience
export type { AppConfiguration };
