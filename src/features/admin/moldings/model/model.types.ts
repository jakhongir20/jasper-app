export type Molding = {
  molding_id: number;
  name: string;
  image_url: string;
  order: number;
  has_under_trim: boolean;
  height_minus_coefficient: number;
  height_plus_coefficient: number;
  is_height_coefficient_applicable: boolean;
  is_height_coefficient_double: boolean;
  width_coefficient_use_case: boolean;
  has_up_trim: boolean;
  has_crown: boolean;
  width_minus_coefficient: number;
  width_plus_coefficient: number;
  height_coefficient_use_case: boolean;
  is_width_coefficient_applicable: boolean;
  is_width_coefficient_double: boolean;
  key: string;
  created_at?: number;
};

export type CreateMoldingPayload = {
  name: string;
  molding_image: string;
  order: number;
  has_up_trim: boolean;
  has_under_trim: boolean;
  has_crown: boolean;
  height_minus_coefficient: number;
  width_minus_coefficient: number;
  height_plus_coefficient: number;
  width_plus_coefficient: number;
  is_height_coefficient_applicable: boolean;
  height_coefficient_use_case: boolean;
  is_height_coefficient_double: boolean;
  is_width_coefficient_applicable: boolean;
  width_coefficient_use_case: boolean;
  is_width_coefficient_double: boolean;
};

export type UpdateMoldingPayload = Partial<CreateMoldingPayload> & {
  molding_id: number;
};

export type MoldingFormData = {
  name: string;
  molding_image: string;
  order: number;
  has_up_trim: boolean;
  has_under_trim: boolean;
  has_crown: boolean;
  height_minus_coefficient: number;
  width_minus_coefficient: number;
  height_plus_coefficient: number;
  width_plus_coefficient: number;
  is_height_coefficient_applicable: boolean;
  height_coefficient_use_case: boolean;
  is_height_coefficient_double: boolean;
  is_width_coefficient_applicable: boolean;
  width_coefficient_use_case: boolean;
  is_width_coefficient_double: boolean;
};
