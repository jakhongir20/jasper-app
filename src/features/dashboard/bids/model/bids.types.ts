import { Dayjs } from "dayjs";
import type { ApplicationOutputEntity } from "@/shared/lib/api";

export type Option = Record<string, string | number | boolean | unknown>;

// Product type for backward compatibility
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

// Taxes type for backward compatibility
export type Taxes = {
  tax_id: number;
  name: string;
  rate: number;
};

export type GeneralFormType = {
  address: string;
  default_door_lock_id: number;
  default_hinge_id: number;
  remark: string;
  sizes: string;
  production_date: Dayjs; // Changed from string to Dayjs for DatePicker compatibility
};

export type ApplicationLocalForm = {
  general: GeneralFormType;
  transactions?: Partial<TransactionFormType[]>;
  application_aspects?: Partial<AspectFormType[]>;
  aspects?: Partial<AspectFormType[]>;
  application_services?: Partial<ApplicationService[]>;
  sheathings?: Partial<ApplicationSheathing[]>;
  baseboards?: Partial<ApplicationBaseboard[]>;
  floors?: Partial<ApplicationFloor[]>;
  windowsills?: Partial<ApplicationWindowsill[]>;
  lattings?: Partial<ApplicationLatting[]>;
  frameworks?: Partial<ApplicationFramework[]>;
  decorations?: Partial<ApplicationDecoration[]>;
  application_qualities?: Partial<ApplicationAdditionalQuality[]>;
  services?: Partial<ApplicationService[]>;
  qualities?: Partial<ApplicationAdditionalQuality[]>;
};

// From the "aspects" table
export type AspectFormType = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  aspect_file_payload: string; // input file
  comment: string; // input
};

// Alias for backward compatibility
export type ApplicationAspect = AspectFormType;

// From the "sheathing" table
export type ApplicationSheathing = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  sheathing_id?: number; // select-api
  sheathing?: any; // Full sheathing object
  height?: number;
  width?: number;
  quantity?: number;
};

// From the "baseboard" table
export type ApplicationBaseboard = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  baseboard_id?: number; // select-api
  baseboard?: any; // Full baseboard object
  length: number;
  quantity: number;
  style: string; // select-static
};

// From the "floors" table
export type ApplicationFloor = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  floor_id: number; // select-api
  floor?: any; // Full floor object
  height: number;
  width: number;
  quantity: number;
  style: string; // select-static
};

// From the "windowsill" table
export type ApplicationWindowsill = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  windowsill_id: number; // select-api
  windowsill?: any; // Full windowsill object
  height: number;
  width: number;
  quantity: number;
  style: string; // select-static
};

// From the "lattings" table
export type ApplicationLatting = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  latting_id: number; // select-api
  latting?: any; // Full latting object
  height: number;
  width: number;
  quantity: number;
  style: string; // select-static
};

// From the "frameworks" table
export type ApplicationFramework = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  framework_id: number; // select-api
  framework?: any; // Full framework object
  height: number;
  width: number;
  quantity: number;
  style?: string; // select-static
};

// From the "decorations" table
export type ApplicationDecoration = {
  id?: number;
  _uid?: string; // Unique identifier for the aspect, used for editing
  decoration_id: number; // select-api
  decoration?: any; // Full decoration object
  quantity: number;
};

// From the "services" table
export type ApplicationService = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  service_id: number; // select-api
  service?: any; // Full service object
  name?: string; // Service name
  quantity: number;
};

// From the "additional_quality" table
export type ApplicationAdditionalQuality = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  quality_id: number; // select-api
  quality?: any; // Full quality object
};

// From the "transactions" table
export type TransactionFormType = {
  _uid?: string; // Unique identifier for the aspect, used for editing
  id?: number;
  location: string;
  door_type: string;
  product_id: number | null;
  product?: any; // Product object
  veneer_type: string;
  lining_number: number | null;
  lining?: any; // Lining object with image_url
  frame_front_id: number | null;
  frame_back_id: number | null;
  frame_front?: any; // Frame object with image_url
  frame_back?: any; // Frame object with image_url
  doorway_type: number;
  doorway_thickness: number;
  height: number;
  width: number;
  quantity: number;
  opening_side: string;
  opening_direction: string;
  box_width: number;
  threshold: string;
  chamfer: string;
  sash: string;
  transom_height_front: number;
  transom_height_back: number;
  crown_quantity: number;
  sheathing_id: number | null;
  sheathing?: any; // Sheathing object
  sheathing_style: string;
  trim_id: number | null;
  trim?: any; // Trim object
  trim_style: string;
  up_trim_id: number | null;
  up_trim?: any; // Up trim object
  up_trim_quantity: number;
  up_trim_style: string;
  under_trim_id: number | null;
  under_trim?: any; // Under trim object
  under_trim_quantity: number;
  under_trim_style: string;
  filler_id: number | null;
  filler?: any; // Filler object
  crown_id: number | null;
  crown?: any; // Crown object
  crown_style: string;
  glass_id: number | null;
  glass?: any; // Glass object
  glass_quantity: number;
  door_lock_id: number | null;
  door_lock?: any; // Door lock object
  door_lock_quantity: number;
  canopy_id: number | null;
  canopy?: any; // Canopy object
  canopy_quantity: number;
  latch_id: number | null;
  latch?: any; // Latch object
  latch_quantity: number;
  box_service_id: number | null;
  box_service?: any; // Box service object
  // Additional fields from API specification
  booklet_number?: string;
  factory_mdf_type?: string;
  factory_height?: number;
  factory_width?: number;
  factory_mdf?: number; // Changed from string to number
  factory_carcass?: number; // Changed from string to number
  factory_rail?: number; // Changed from string to number
  catalogue_number?: string;
  pattern_form?: string;
  quality_multiplier?: number;
  volume?: number;
  volume_product?: number;
  sheathing_height?: number;
  sheathing_width?: number;
  sheathing_thickness?: number;
  sheathing_quantity?: number;
  trim_height?: number;
  trim_width?: number;
  trim_quantity?: number;
  filler_height?: number;
  filler_width?: number;
  filler_quantity?: number;
  crown_height?: number;
  crown_width?: number;
  box_service_quantity?: number;
  box_service_length?: number;
};

export type ApplicationListItem = ApplicationOutputEntity;
