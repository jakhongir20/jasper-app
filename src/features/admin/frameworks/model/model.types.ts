export type Framework = {
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

// Backward compatibility aliases
export type Molding = Framework;
export type MoldingWithLegacyId = Framework & { molding_id: number };

export type CreateFrameworkPayload = {
  name: string;
  framework_image: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

export type UpdateFrameworkPayload = {
  name?: string;
  framework_image?: string;
  order_number?: number;
  doorway_type?: number;
  is_frame?: boolean;
  is_filler?: boolean;
};

export type FrameworkFormData = {
  name: string;
  image_url: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

// Backward compatibility aliases
export type CreateMoldingPayload = CreateFrameworkPayload;
export type UpdateMoldingPayload = UpdateFrameworkPayload;
export type MoldingFormData = FrameworkFormData;
