export type Molding = {
  framework_id: number;
  name: string;
  image_url: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
  created_at?: number;
  has_up_frame?: boolean;
  has_under_frame?: boolean;
  has_crown?: boolean;
  has_transom?: boolean;
  is_deleted?: boolean;
  deleted_at?: number;
};

// Alias for backward compatibility
export type MoldingWithLegacyId = Molding & { molding_id: number };

export type CreateMoldingPayload = {
  name: string;
  image_url: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

export type UpdateMoldingPayload = {
  name: string;
  image_url: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

export type MoldingFormData = {
  name: string;
  image_url: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};
