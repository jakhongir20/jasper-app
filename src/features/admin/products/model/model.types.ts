export type Product = {
  product_id: number;
  name: string;
  product_type: string;
  price_uzs: number;
  price_usd: number;
  measure: string;
  feature: string;
  crown_coefficient: number;
  up_under_trim_height: number;
  up_under_trim_width: number;
  category_id: number;
  category: {
    category_id: number;
    name: string;
    section: number;
  };
};

export type CreateProductPayload = {
  name: string;
  product_type: string;
  price_uzs: number;
  price_usd: number;
  measure: string;
  feature: string;
  crown_coefficient: number;
  up_under_trim_height: number;
  up_under_trim_width: number;
  category_id: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  product_id: number;
};

export type ProductFormData = {
  name: string;
  product_type: string;
  price_uzs: number;
  price_usd: number;
  measure: string;
  feature: string;
  crown_coefficient: number;
  up_under_trim_height: number;
  up_under_trim_width: number;
  category_id: number;
};
