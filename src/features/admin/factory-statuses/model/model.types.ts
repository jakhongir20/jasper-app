export interface FactoryStatus {
  factory_status_id: number;
  name: string;
  created_at?: number;
}

export interface CreateFactoryStatusPayload {
  name: string;
}

export interface UpdateFactoryStatusPayload {
  factory_status_id: number;
  name: string;
}

export interface FactoryStatusFormData {
  name: string;
}
