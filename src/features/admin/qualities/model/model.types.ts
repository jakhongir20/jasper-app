export interface Quality {
  quality_id: number;
  name: string;
  created_at?: number;
}

export interface CreateQualityPayload {
  name: string;
}

export interface UpdateQualityPayload {
  quality_id: number;
  name: string;
}

export interface QualityFormData {
  name: string;
}
