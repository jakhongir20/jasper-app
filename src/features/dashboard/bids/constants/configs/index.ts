// Form field configuration
export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "input"
    | "select"
    | "selectInfinitive"
    | "file"
    | "number"
    | "textarea"
    | "image";
  required?: boolean;
  options?: string;
  integerOnly?: boolean; // For number fields - disallow decimals
  apiConfig?: {
    fetchUrl: string;
    valueKey: string;
    labelKey: string | string[];
    queryKey?: string;
    params?: Record<string, string | number | boolean | unknown>;
  };
}

// Transaction form field configuration
export const transactionFormFields: FormFieldConfig[] = [
  // 1. location
  {
    name: "location",
    label: "common.input.location",
    type: "input",
    required: true,
  },
  // 2. product_type (product_id)
  {
    name: "product_id",
    label: "common.input.type",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "feature"],
      params: { category_id: 11 },
    },
  },
  // 3. height
  {
    name: "height",
    label: "common.input.height",
    type: "number",
  },
  // 4. width
  {
    name: "width",
    label: "common.input.width",
    type: "number",
  },
  // 5. doorway_thickness
  {
    name: "doorway_thickness",
    label: "common.input.doorway_thickness",
    type: "number",
  },
  // 6. quantity
  {
    name: "quantity",
    label: "common.input.quantity",
    type: "number",
  },
  // 7. opening_side/direction
  {
    name: "opening_side",
    label: "common.input.opening_side",
    type: "select",
    options: "openingSideOptions",
  },
  {
    name: "opening_direction",
    label: "common.input.opening_direction",
    type: "select",
    options: "openingDirectionOptions",
  },
  // Additional fields (keeping original order for the rest)
  {
    name: "door_type",
    label: "common.input.doorType",
    type: "select",
    options: "doorTypeOptions",
  },
  // box_width is placed right after door_type so users see it when selecting ДО/ДГ
  // It becomes required when door_type is ДО or ДГ (handled dynamically in TransactionsModal)
  {
    name: "box_width",
    label: "common.input.box_width",
    type: "number",
  },
  {
    name: "veneer_type",
    label: "common.input.veenerType",
    type: "select",
    options: "veenerTypeOptions",
  },
  {
    name: "lining_number",
    label: "common.input.lining_number",
    type: "image",
    apiConfig: {
      fetchUrl: "/lining/all",
      valueKey: "lining_id",
      labelKey: "image_url",
    },
  },
  {
    name: "doorway_type",
    label: "common.input.doorway_type",
    type: "select",
    options: "doorwayTypeOptions",
  },
  {
    name: "frame_front_id",
    label: "common.input.frame_front",
    type: "image",
    apiConfig: {
      fetchUrl: "/framework/all",
      valueKey: "framework_id",
      labelKey: "image_url",
    },
  },

  {
    name: "frame_back_id",
    label: "common.input.frame_back",
    type: "image",
    apiConfig: {
      fetchUrl: "/framework/all",
      valueKey: "framework_id",
      labelKey: "image_url",
    },
  },
  {
    name: "threshold",
    label: "common.input.threshold",
    type: "select",
    options: "thresholdTypeOptions",
  },
  {
    name: "chamfer",
    label: "common.input.chamfer",
    type: "select",
    options: "chamferOptions",
  },
  {
    name: "sash",
    label: "common.input.sash",
    type: "select",
    options: "sashOptions",
  },
  {
    name: "transom_height_front",
    label: "common.input.transom_height_front",
    type: "number",
  },
  {
    name: "transom_height_back",
    label: "common.input.transom_height_back",
    type: "number",
  },
  {
    name: "sheathing_id",
    label: "common.input.sheathing_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 13 },
    },
  },
  {
    name: "sheathing_style",
    label: "common.input.sheathing_style",
    type: "select",
    options: "sheathingOptions",
  },
  {
    name: "trim_id",
    label: "common.input.trim_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 7 },
    },
  },
  {
    name: "trim_style",
    label: "common.input.trim_style",
    type: "select",
    options: "trimStyleOptions",
  },
  {
    name: "up_trim_id",
    label: "common.input.up_trim_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 5 },
    },
  },
  {
    name: "up_trim_quantity",
    label: "common.input.up_trim_quantity",
    type: "number",
  },
  {
    name: "up_trim_style",
    label: "common.input.up_trim_style",
    type: "select",
    options: "upTrimStyleOptions",
  },
  {
    name: "under_trim_id",
    label: "common.input.under_trim_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 6 },
    },
  },
  {
    name: "under_trim_quantity",
    label: "common.input.under_trim_quantity",
    type: "number",
  },
  {
    name: "under_trim_style",
    label: "common.input.under_trim_style",
    type: "select",
    options: "underTrimStyleOptions",
  },
  {
    name: "filler_id",
    label: "common.input.filler_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 9 },
    },
  },
  {
    name: "crown_id",
    label: "common.input.crown_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "feature"],
      params: { category_id: 10 },
    },
  },
  {
    name: "crown_style",
    label: "common.input.crown_style",
    type: "select",
    options: "crownStyleOptions",
  },
  {
    name: "glass_id",
    label: "common.input.glass_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 1 },
    },
  },
  {
    name: "glass_quantity",
    label: "common.input.glass_quantity",
    type: "number",
  },
  {
    name: "door_lock_id",
    label: "common.input.door_lock_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 2 },
    },
  },
  {
    name: "door_lock_quantity",
    label: "common.input.door_lock_quantity",
    type: "number",
  },
  {
    name: "canopy_id",
    label: "common.input.canopy_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 3 },
    },
  },
  {
    name: "canopy_quantity",
    label: "common.input.canopy_quantity",
    type: "number",
  },
  {
    name: "latch_id",
    label: "common.input.latch_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 12 },
    },
  },
  {
    name: "latch_quantity",
    label: "common.input.latch_quantity",
    type: "number",
  },
  {
    name: "box_service_id",
    label: "common.input.box_service_id",
    type: "selectInfinitive",
    apiConfig: {
      fetchUrl: "/product/by/category",
      valueKey: "product_id",
      labelKey: ["name", "measure"],
      params: { category_id: 14 },
    },
  },
  // Additional fields from API specification
  {
    name: "booklet_number",
    label: "common.input.booklet_number",
    type: "input",
  },
  {
    name: "catalogue_number",
    label: "common.input.catalogue_number",
    type: "input",
  },
  {
    name: "pattern_form",
    label: "common.input.pattern_form",
    type: "input",
  },
  {
    name: "quality_multiplier",
    label: "common.input.quality_multiplier",
    type: "number",
  },
  {
    name: "volume_product",
    label: "common.input.volume_product",
    type: "number",
  },
  {
    name: "volume_product",
    label: "common.input.volume_product",
    type: "number",
  },
  {
    name: "sheathing_height",
    label: "common.input.sheathing_height",
    type: "number",
  },
  {
    name: "sheathing_width",
    label: "common.input.sheathing_width",
    type: "number",
  },
  {
    name: "sheathing_thickness",
    label: "common.input.sheathing_thickness",
    type: "number",
  },
  {
    name: "sheathing_quantity",
    label: "common.input.sheathing_quantity",
    type: "number",
  },
  {
    name: "trim_height",
    label: "common.input.trim_height",
    type: "number",
  },
  {
    name: "trim_width",
    label: "common.input.trim_width",
    type: "number",
  },
  {
    name: "trim_quantity",
    label: "common.input.trim_quantity",
    type: "number",
  },
  {
    name: "filler_height",
    label: "common.input.filler_height",
    type: "number",
  },
  {
    name: "filler_width",
    label: "common.input.filler_width",
    type: "number",
  },
  {
    name: "filler_quantity",
    label: "common.input.filler_quantity",
    type: "number",
  },
  {
    name: "crown_height",
    label: "common.input.crown_height",
    type: "number",
  },
  {
    name: "crown_width",
    label: "common.input.crown_width",
    type: "number",
  },
  {
    name: "box_service_quantity",
    label: "common.input.box_service_quantity",
    type: "number",
  },
  {
    name: "box_service_length",
    label: "common.input.box_service_length",
    type: "number",
  },
];

// Aspect form fields configuration
export const aspectFormFields: FormFieldConfig[] = [
  {
    name: "aspect_file_payload",
    label: "common.labels.aspect",
    type: "file",
    required: true,
  },
  {
    name: "aspect_file_name",
    label: "common.labels.aspectFileName",
    type: "input",
    required: true,
  },
  {
    name: "comment",
    label: "common.labels.comment",
    type: "textarea",
    required: true,
  },
];

// Sheathing form fields configuration
export const sheathingFormFields: FormFieldConfig[] = [
  {
    name: "sheathing_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/sheathing/all",
      valueKey: "sheathing_id",
      labelKey: ["name", "features"],
      params: { category_id: 14 },
    },
  },
  {
    name: "height",
    label: "common.labels.height",
    type: "number",
    required: true,
  },
  {
    name: "width",
    label: "common.labels.width",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
];

// Baseboard form fields configuration
export const baseboardFormFields: FormFieldConfig[] = [
  {
    name: "baseboard_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/baseboard/all",
      valueKey: "baseboard_id",
      labelKey: ["name", "features"],
    },
  },
  {
    name: "length",
    label: "common.labels.length",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
  {
    name: "style",
    label: "common.labels.style",
    type: "select",
    options: "photoStyleOptions",
  },
];

// Floor form fields configuration
export const floorFormFields: FormFieldConfig[] = [
  {
    name: "floor_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/floor/all",
      valueKey: "floor_id",
      labelKey: ["name", "features"],
    },
  },
  {
    name: "height",
    label: "common.labels.height",
    type: "number",
    required: true,
  },
  {
    name: "width",
    label: "common.labels.width",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
  {
    name: "style",
    label: "common.labels.style",
    type: "select",
    options: "photoStyleOptions",
  },
];

// Windowsill form fields configuration
export const windowsillFormFields: FormFieldConfig[] = [
  {
    name: "windowsill_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/windowsill/all",
      valueKey: "windowsill_id",
      labelKey: ["name", "features"],
    },
  },
  {
    name: "height",
    label: "common.labels.height",
    type: "number",
    required: true,
  },
  {
    name: "width",
    label: "common.labels.width",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
  {
    name: "style",
    label: "common.labels.style",
    type: "select",
    options: "photoStyleOptions",
  },
];

// Latting form fields configuration
export const lattingFormFields: FormFieldConfig[] = [
  {
    name: "latting_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/latting/all",
      valueKey: "latting_id",
      labelKey: ["name", "features"],
    },
  },
  {
    name: "height",
    label: "common.labels.height",
    type: "number",
    required: true,
  },
  {
    name: "width",
    label: "common.labels.width",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
  {
    name: "style",
    label: "common.labels.style",
    type: "select",
    options: "photoStyleOptions",
  },
];

// Framework form fields configuration
export const frameworkFormFields: FormFieldConfig[] = [
  {
    name: "framework_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/framework/all",
      valueKey: "framework_id",
      labelKey: ["name", "features"],
    },
  },
  {
    name: "height",
    label: "common.labels.height",
    type: "number",
    required: true,
  },
  {
    name: "width",
    label: "common.labels.width",
    type: "number",
    required: true,
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
  },
  {
    name: "style",
    label: "common.labels.style",
    type: "select",
    options: "photoStyleOptions",
  },
];

// Decoration form fields configuration
export const decorationFormFields: FormFieldConfig[] = [
  {
    name: "decoration_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/decoration/all",
      valueKey: "decoration_id",
      labelKey: "name",
    },
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
    integerOnly: true,
  },
];

// Service form fields configuration
export const serviceFormFields: FormFieldConfig[] = [
  {
    name: "service_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/service/all",
      valueKey: "service_id",
      labelKey: "name",
    },
  },
  {
    name: "quantity",
    label: "common.labels.quantity",
    type: "number",
    required: true,
    integerOnly: true,
  },
];

// Quality form fields configuration
export const qualityFormFields: FormFieldConfig[] = [
  {
    name: "quality_id",
    label: "common.labels.name",
    type: "selectInfinitive",
    required: true,
    apiConfig: {
      fetchUrl: "/quality/all",
      valueKey: "quality_id",
      labelKey: "name",
    },
  },
];

// Style options for "По фото"
