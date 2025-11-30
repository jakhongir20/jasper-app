export type Molding = {
  molding_id: number;
  name: string;
  framework_image: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
  created_at?: number;
};

export type CreateMoldingPayload = {
  name: string;
  framework_image: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

export type UpdateMoldingPayload = {
  name: string;
  framework_image: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};

export type MoldingFormData = {
  name: string;
  framework_image: string;
  order_number: number;
  doorway_type: number;
  is_frame: boolean;
  is_filler: boolean;
};
