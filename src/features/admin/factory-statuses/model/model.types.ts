export interface FactoryStatus {
  factory_status_id: number;
  name: string;
  status_index: number;
  status_order: number;
  is_initial_status: boolean;
  is_final_status: boolean;
  created_at?: number;
}

export interface CreateFactoryStatusPayload {
  name: string;
  status_index: number;
  status_order: number;
  is_initial_status: boolean;
  is_final_status: boolean;
}

export interface UpdateFactoryStatusPayload {
  factory_status_id: number;
  name?: string;
  status_index?: number;
  status_order?: number;
  is_initial_status?: boolean;
  is_final_status?: boolean;
}

export interface FactoryStatusFormData {
  name: string;
  status_index: number;
  status_order: number;
  is_initial_status: boolean;
  is_final_status: boolean;
}
