export interface Service {
  service_id: number;
  name?: string;
  unique_name?: string;
  features?: string;
  measure?: string;
  price_uzs?: number;
  price_usd?: number;
  is_deleted?: boolean;
  created_at?: number;
  deleted_at?: number;
}

export interface CreateServicePayload {
  name: string;
  measure?: string;
  price_uzs?: number;
  price_usd?: number;
}

export interface UpdateServicePayload {
  service_id: number;
  name?: string;
  measure?: string;
  price_uzs?: number;
  price_usd?: number;
}

export interface ServiceFormData {
  name: string;
  measure?: string;
  price_uzs?: number;
  price_usd?: number;
}
