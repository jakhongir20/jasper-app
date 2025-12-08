export type ProductImage = {
  product_image_id: number;
  created_at: number;
  assignment: string;
  image_url: string;
};

export type Product = {
  product_id: number;
  created_at: number;
  name: string;
  product_type: string;
  price_uzs: number;
  price_usd: number;
  measure: string;
  measurement_unit?: string;
  feature?: string;
  crown_coefficient?: number;
  up_under_trim_height?: number;
  up_under_trim_width?: number;
  category: {
    category_id: number;
    name: string;
    section?: number;
    section_index?: number;
  };
  product_images?: ProductImage[];
  frame_thickness?: number;
  frame_width?: number;
  under_frame_height?: number;
  percent_trim?: number;
  percent_molding?: number;
  percent_covering_primary?: number;
  percent_covering_secondary?: number;
  percent_color?: number;
  percent_extra_option?: number;
};

export type ProductImageInput = {
  assignment: string;
  image_file: string;
};

export type CreateProductPayload = {
  name: string;
  product_type: string;
  product_images: ProductImageInput[];
  price_uzs: number;
  price_usd: number;
  measurement_unit: string;
  category_id: number;
  frame_thickness: number;
  frame_width: number;
  under_frame_height: number;
  percent_trim: number;
  percent_molding: number;
  percent_covering_primary: number;
  percent_covering_secondary: number;
  percent_color: number;
  percent_extra_option: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductFormData = {
  name: string;
  product_type: string;
  product_images: ProductImageInput[];
  price_uzs: number;
  price_usd: number;
  measurement_unit: string;
  category_id: number;
  frame_thickness: number;
  frame_width: number;
  under_frame_height: number;
  percent_trim: number;
  percent_molding: number;
  percent_covering_primary: number;
  percent_covering_secondary: number;
  percent_color: number;
  percent_extra_option: number;
};
