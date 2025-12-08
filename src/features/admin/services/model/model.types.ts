export interface Service {
  service_id: number;
  name: string;
  created_at?: number;
}

export interface CreateServicePayload {
  name: string;
}

export interface UpdateServicePayload {
  service_id: number;
  name: string;
}

export interface ServiceFormData {
  name: string;
}
