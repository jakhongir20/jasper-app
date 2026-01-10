export interface Resource {
  resource_id: number;
  name: string;
  resource_type?: string;
  price_usd: number;
  price_uzs?: number;
  measurement_unit: string;
  is_deleted: boolean;
  created_at: number;
  deleted_at?: number;
}

export interface CreateResourcePayload {
  name: string;
  resource_type: string;
  price_usd: number;
  price_uzs?: number;
  measurement_unit: string;
}

export interface UpdateResourcePayload {
  resource_id: number;
  name?: string;
  resource_type?: string;
  price_usd?: number;
  price_uzs?: number;
  measurement_unit?: string;
}

export interface ResourceFormData {
  name: string;
  resource_type: string;
  price_usd: number;
  price_uzs?: number;
  measurement_unit: string;
}

export const RESOURCE_TYPES = [
  { value: "raw-material", label: "Сырьё" },
  { value: "paint", label: "Краска" },
] as const;
