type PrimitiveRecord = Record<string, any>;

export const toNullableNumber = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

export const normalizeString = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  const stringValue = String(value).trim();
  return stringValue.length === 0 ? null : stringValue;
};

export const extractId = (
  value: any,
  keys: string[] = [
    "product_id",
    "category_section_index",
    "category_id",
    "customer_id",
    "service_id",
    "quality_id",
    "value",
    "id",
  ],
): number | null => {
  if (value && typeof value === "object") {
    for (const key of keys) {
      if (value[key] !== undefined && value[key] !== null) {
        const candidate = value[key];
        const numericCandidate = Number(candidate);

        if (!Number.isNaN(numericCandidate)) {
          return numericCandidate;
        }
      }
    }
  }

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const LEGACY_PRODUCT_TYPE_MAP: Record<string, string> = {
  ДО: "door-window",
  "ДО дверь": "door-window",
  ДГ: "door-deaf",
  "ДГ дверь": "door-deaf",
  "Обшивочный проём": "doorway",
  "Обшивочный проем": "doorway",
  Окно: "window",
  Подоконник: "windowsill",
  "Тёплый пол": "heated-floor",
  "Теплый пол": "heated-floor",
  Обрешётка: "latting",
  Обрешетка: "latting",
  // Map component types to their typical product type
  transom: "door-window",
  Фрамуга: "door-window",
  frame: "doorway",
  Наличник: "doorway",
  filler: "doorway",
  Нашельник: "doorway",
  crown: "doorway",
  Корона: "doorway",
  up_frame: "doorway",
  Надналичник: "doorway",
  under_frame: "doorway",
  Подналичник: "doorway",
  trim: "doorway",
  Обклад: "doorway",
  molding: "doorway",
  Молдинг: "doorway",
  covering_primary: "door-window",
  "Покрытие I": "door-window",
  covering_secondary: "door-window",
  "Покрытие II": "door-window",
  color: "door-window",
  Цвет: "door-window",
  floor_skirting: "doorway",
  Плинтус: "doorway",
  glass: "window",
  Стекло: "window",
  door_lock: "door-window",
  "Замок двери": "door-window",
  hinge: "door-window",
  Петля: "door-window",
  door_bolt: "door-window",
  Шпингалет: "door-window",
  door_stopper: "door-window",
  Стоппер: "door-window",
  anti_threshold: "door-window",
  "Анти-порог": "door-window",
  box_width: "door-window",
  "Ширина коробки": "door-window",
  extra_options: "door-window",
  "Доп. опции": "door-window",
};

const normalizeProductType = (rawType: any): string | null => {
  if (!rawType) {
    return null;
  }
  const normalized = String(rawType).trim();
  return LEGACY_PRODUCT_TYPE_MAP[normalized] ?? normalized;
};

/**
 * Cleans transaction data to ensure product IDs are null if their volumes/quantities are null or 0
 * This prevents validation errors in service-manager endpoint
 */
export const cleanTransactionForServiceManager = (
  transaction: PrimitiveRecord,
): PrimitiveRecord => {
  const cleaned = { ...transaction };

  // If latting has no volume or no product_id, clear both
  if (!cleaned.volume_latting || !cleaned.latting_product_id) {
    cleaned.latting_product_id = null;
    cleaned.volume_latting = null;
  }

  // If windowsill has no volume or no product_id, clear both
  if (!cleaned.volume_windowsill || !cleaned.windowsill_product_id) {
    cleaned.windowsill_product_id = null;
    cleaned.volume_windowsill = null;
  }

  // If heated floor has no volume or no product_id, clear both
  if (!cleaned.volume_heated_floor || !cleaned.heated_floor_product_id) {
    cleaned.heated_floor_product_id = null;
    cleaned.volume_heated_floor = null;
  }

  // If window has no volume or no product_id, clear both
  if (!cleaned.volume_window || !cleaned.window_product_id) {
    cleaned.window_product_id = null;
    cleaned.volume_window = null;
  }

  // If glass has no quantity or no product_id, clear both
  if (!cleaned.glass_quantity || !cleaned.glass_product_id) {
    cleaned.glass_product_id = null;
    cleaned.glass_quantity = null;
    cleaned.volume_glass = null;
  }

  return cleaned;
};

export const buildTransactionPayload = (
  transaction: PrimitiveRecord,
): PrimitiveRecord => {
  const data = {
    location: normalizeString(transaction.location),
    product_type: normalizeProductType(
      transaction.product_type ?? transaction.door_type,
    ),
    opening_height: toNullableNumber(transaction.opening_height),
    opening_width: toNullableNumber(transaction.opening_width),
    opening_thickness: toNullableNumber(transaction.opening_thickness),
    entity_quantity: toNullableNumber(transaction.entity_quantity),
    framework_front_id: extractId(transaction.framework_front_id, [
      "framework_id",
      "product_id",
      "id",
      "value",
    ]),
    framework_back_id: extractId(transaction.framework_back_id, [
      "framework_id",
      "product_id",
      "id",
      "value",
    ]),
    threshold: normalizeString(transaction.threshold),
    opening_logic: normalizeString(transaction.opening_logic),
    sash: toNullableNumber(transaction.sash),
    chamfer: toNullableNumber(transaction.chamfer),
    transom_type: toNullableNumber(transaction.transom_type),
    transom_product_id: extractId(transaction.transom_product_id),
    transom_height_front: toNullableNumber(transaction.transom_height_front),
    transom_height_back: toNullableNumber(transaction.transom_height_back),
    door_product_id: extractId(transaction.door_product_id),
    sheathing_product_id: extractId(transaction.sheathing_product_id),
    frame_product_id: extractId(transaction.frame_product_id),
    volume_frame: toNullableNumber(transaction.volume_frame),
    filler_product_id: extractId(transaction.filler_product_id),
    volume_filler: toNullableNumber(transaction.volume_filler),
    crown_product_id: extractId(transaction.crown_product_id),
    volume_crown: toNullableNumber(transaction.volume_crown),
    up_frame_quantity: toNullableNumber(transaction.up_frame_quantity),
    up_frame_product_id: extractId(transaction.up_frame_product_id),
    under_frame_quantity: toNullableNumber(transaction.under_frame_quantity),
    under_frame_height: toNullableNumber(transaction.under_frame_height),
    under_frame_product_id: extractId(transaction.under_frame_product_id),
    percent_trim: toNullableNumber(transaction.percent_trim),
    trim_product_id: extractId(transaction.trim_product_id),
    percent_molding: toNullableNumber(transaction.percent_molding),
    molding_product_id: extractId(transaction.molding_product_id),
    percent_covering_primary: toNullableNumber(
      transaction.percent_covering_primary,
    ),
    covering_primary_product_id: extractId(
      transaction.covering_primary_product_id,
    ),
    percent_covering_secondary: toNullableNumber(
      transaction.percent_covering_secondary,
    ),
    covering_secondary_product_id: extractId(
      transaction.covering_secondary_product_id,
    ),
    percent_color: toNullableNumber(transaction.percent_color),
    color_product_id: extractId(transaction.color_product_id),
    color_custom_name: normalizeString(transaction.color_custom_name),
    floor_skirting_length: toNullableNumber(transaction.floor_skirting_length),
    floor_skirting_product_id: extractId(transaction.floor_skirting_product_id),
    heated_floor_product_id: extractId(transaction.heated_floor_product_id),
    volume_heated_floor: toNullableNumber(transaction.volume_heated_floor),
    windowsill_product_id: extractId(transaction.windowsill_product_id),
    volume_windowsill: toNullableNumber(transaction.volume_windowsill),
    latting_product_id: extractId(transaction.latting_product_id),
    volume_latting: toNullableNumber(transaction.volume_latting),
    window_product_id: extractId(transaction.window_product_id),
    volume_window: toNullableNumber(transaction.volume_window),
    glass_product_id: extractId(transaction.glass_product_id),
    volume_glass: toNullableNumber(transaction.volume_glass),
    door_lock_mechanism: normalizeString(transaction.door_lock_mechanism),
    door_lock_product_id: extractId(transaction.door_lock_product_id),
    hinge_mechanism: normalizeString(transaction.hinge_mechanism),
    hinge_product_id: extractId(transaction.hinge_product_id),
    door_bolt_product_id: extractId(transaction.door_bolt_product_id),
    door_stopper_quantity: toNullableNumber(transaction.door_stopper_quantity),
    door_stopper_product_id: extractId(transaction.door_stopper_product_id),
    anti_threshold_quantity: toNullableNumber(
      transaction.anti_threshold_quantity,
    ),
    anti_threshold_product_id: extractId(transaction.anti_threshold_product_id),
    box_width: toNullableNumber(transaction.box_width),
    box_width_length: toNullableNumber(transaction.box_width_length),
    percent_extra_option: toNullableNumber(transaction.percent_extra_option),
    extra_option_product_id: extractId(transaction.extra_option_product_id),
  };
  return data;
};

const resolveProductType = (transaction: PrimitiveRecord): string | null => {
  const rawType =
    transaction.product_type ??
    transaction.door_type ??
    transaction?.product?.product_type ??
    transaction?.product?.category?.name ??
    null;

  return normalizeProductType(rawType);
};

const resolveOpeningLogic = (transaction: PrimitiveRecord) =>
  transaction.opening_logic ??
  transaction.opening_direction ??
  transaction.opening_side ??
  null;

const resolveFrameworkFrontId = (transaction: PrimitiveRecord) =>
  extractId(
    transaction.front_framework_id ??
      transaction.framework_front_id ??
      transaction.frame_front_id ??
      transaction?.framework_front?.framework_id ??
      transaction?.frame_front?.framework_id ??
      transaction?.framework_front?.product_id ??
      transaction?.frame_front?.product_id,
    ["framework_id", "product_id", "id", "value"],
  );

const resolveFrameworkBackId = (transaction: PrimitiveRecord) =>
  extractId(
    transaction.back_framework_id ??
      transaction.framework_back_id ??
      transaction.frame_back_id ??
      transaction?.framework_back?.framework_id ??
      transaction?.frame_back?.framework_id ??
      transaction?.framework_back?.product_id ??
      transaction?.frame_back?.product_id,
    ["framework_id", "product_id", "id", "value"],
  );

export const transformTransactionDetailToForm = (
  transaction: PrimitiveRecord,
): PrimitiveRecord => {
  const productType = resolveProductType(transaction);

  const openingHeight =
    transaction.opening_height ??
    transaction.height ??
    transaction.factory_height ??
    null;
  const openingWidth =
    transaction.opening_width ??
    transaction.width ??
    transaction.factory_width ??
    null;
  const openingThickness =
    transaction.opening_thickness ??
    transaction.doorway_thickness ??
    transaction.doorway_type ??
    null;
  const entityQuantity =
    transaction.entity_quantity ??
    transaction.quantity ??
    transaction.factory_quantity ??
    null;

  const doorProductId = extractId(
    transaction.door_product_id ??
      transaction.product_id ??
      transaction?.product?.product_id,
  );
  const frameProductId = extractId(
    transaction.frame_product_id ??
      transaction.frame_id ??
      transaction?.frame?.product_id ??
      transaction.trim_id ??
      transaction?.trim?.product_id,
  );
  const fillerProductId = extractId(
    transaction.filler_product_id ??
      transaction.filler_id ??
      transaction?.filler?.product_id,
  );
  const crownProductId = extractId(
    transaction.crown_product_id ??
      transaction.crown_id ??
      transaction?.crown?.product_id,
  );
  const upFrameProductId = extractId(
    transaction.up_frame_product_id ??
      transaction.up_trim_id ??
      transaction?.up_trim?.product_id,
  );
  const underFrameProductId = extractId(
    transaction.under_frame_product_id ??
      transaction.under_trim_id ??
      transaction?.under_trim?.product_id,
  );
  const trimProductId = extractId(
    transaction.trim_product_id ??
      transaction.trim_id ??
      transaction?.trim?.product_id,
  );
  const moldingProductId = extractId(
    transaction.molding_product_id ??
      transaction.molding_id ??
      transaction?.molding?.product_id,
  );
  const coveringPrimaryProductId = extractId(
    transaction.covering_primary_product_id ??
      transaction.covering_primary_id ??
      transaction?.covering_primary?.product_id,
  );
  const coveringSecondaryProductId = extractId(
    transaction.covering_secondary_product_id ??
      transaction.covering_secondary_id ??
      transaction?.covering_secondary?.product_id,
  );
  const colorProductId = extractId(
    transaction.color_product_id ??
      transaction.color_id ??
      transaction?.color?.product_id,
  );
  const floorSkirtingProductId = extractId(
    transaction.floor_skirting_product_id ??
      transaction.floor_skirting_id ??
      transaction?.floor_skirting?.product_id,
  );
  const heatedFloorProductId = extractId(
    transaction.heated_floor_product_id ??
      transaction.heated_floor_id ??
      transaction?.heated_floor?.product_id,
  );
  const lattingProductId = extractId(
    transaction.latting_product_id ??
      transaction.latting_id ??
      transaction?.latting?.product_id,
  );
  const windowProductId = extractId(
    transaction.window_product_id ??
      transaction.window_id ??
      transaction?.window?.product_id,
  );
  const windowsillProductId = extractId(
    transaction.windowsill_product_id ??
      transaction.windowsill_id ??
      transaction?.windowsill?.product_id,
  );
  const glassProductId = extractId(
    transaction.glass_product_id ??
      transaction.glass_id ??
      transaction?.glass?.product_id,
  );
  const doorLockProductId = extractId(
    transaction.door_lock_product_id ??
      transaction.door_lock_id ??
      transaction?.door_lock?.product_id,
  );
  const hingeProductId = extractId(
    transaction.hinge_product_id ??
      transaction.canopy_id ??
      transaction?.hinge?.product_id ??
      transaction?.canopy?.product_id,
  );
  const doorBoltProductId = extractId(
    transaction.door_bolt_product_id ??
      transaction.latch_id ??
      transaction?.door_bolt?.product_id ??
      transaction?.latch?.product_id,
  );
  const doorStopperProductId = extractId(
    transaction.door_stopper_product_id ??
      transaction.door_stopper_id ??
      transaction?.door_stopper?.product_id,
  );
  const antiThresholdProductId = extractId(
    transaction.anti_threshold_product_id ??
      transaction.anti_threshold_id ??
      transaction?.anti_threshold?.product_id,
  );
  const extraOptionProductId = extractId(
    transaction.extra_option_product_id ??
      transaction.extra_option_id ??
      transaction?.extra_option?.product_id,
  );
  const transomProductId = extractId(
    transaction.transom_product_id ??
      transaction.transom_id ??
      transaction?.transom?.product_id,
  );
  const sheathingProductId = extractId(
    transaction.sheathing_product_id ??
      transaction.sheathing_id ??
      transaction?.sheathing?.product_id,
  );

  // Helper to get full product object or just ID
  const getProductValue = (
    productId: number | null,
    productObject: any,
    idKey: string = "product_id",
  ) => {
    if (
      productObject &&
      typeof productObject === "object" &&
      productObject[idKey]
    ) {
      return productObject;
    }
    return productId;
  };

  return {
    // Keep location as-is if it's an object (from API), otherwise use empty string
    location:
      transaction.location && typeof transaction.location === "object"
        ? transaction.location
        : (transaction.location ?? ""),
    product_type: productType,
    door_type: productType,
    opening_height: openingHeight,
    height: openingHeight,
    opening_width: openingWidth,
    width: openingWidth,
    opening_thickness: openingThickness,
    doorway_thickness: openingThickness,
    entity_quantity: entityQuantity,
    quantity: entityQuantity,
    front_framework_id: resolveFrameworkFrontId(transaction),
    back_framework_id: resolveFrameworkBackId(transaction),
    framework_front_id:
      transaction.framework_front ?? resolveFrameworkFrontId(transaction),
    framework_back_id:
      transaction.framework_back ?? resolveFrameworkBackId(transaction),
    frame_front_id: resolveFrameworkFrontId(transaction),
    frame_back_id: resolveFrameworkBackId(transaction),
    threshold: transaction.threshold ?? null,
    opening_logic: resolveOpeningLogic(transaction),
    sash: transaction.sash ?? null,
    chamfer: transaction.chamfer ?? null,
    transom_type: transaction.transom_type ?? null,
    transom_height_front: transaction.transom_height_front ?? null,
    transom_height_back: transaction.transom_height_back ?? null,
    transom_product_id: getProductValue(
      transomProductId,
      transaction.transom_product ?? transaction.transom,
    ),
    door_product_id: getProductValue(
      doorProductId,
      transaction.door_product ?? transaction.product,
    ),
    product_id: doorProductId,
    sheathing_product_id: getProductValue(
      sheathingProductId,
      transaction.sheathing_product ?? transaction.sheathing,
    ),
    frame_product_id: getProductValue(
      frameProductId,
      transaction.frame_product ?? transaction.frame,
    ),
    volume_frame: transaction.volume_frame ?? null,
    filler_product_id: getProductValue(
      fillerProductId,
      transaction.filler_product ?? transaction.filler,
    ),
    volume_filler: transaction.volume_filler ?? null,
    crown_product_id: getProductValue(
      crownProductId,
      transaction.crown_product ?? transaction.crown,
    ),
    volume_crown: transaction.volume_crown ?? null,
    up_frame_quantity:
      transaction.up_frame_quantity ?? transaction.up_trim_quantity ?? null,
    up_frame_product_id: getProductValue(
      upFrameProductId,
      transaction.up_frame_product ??
        transaction.up_frame ??
        transaction.up_trim,
    ),
    under_frame_quantity:
      transaction.under_frame_quantity ??
      transaction.under_trim_quantity ??
      null,
    under_frame_height: transaction.under_frame_height ?? null,
    under_frame_product_id: getProductValue(
      underFrameProductId,
      transaction.under_frame_product ??
        transaction.under_frame ??
        transaction.under_trim,
    ),
    percent_trim: transaction.percent_trim ?? transaction.trim_percent ?? null,
    trim_product_id: getProductValue(
      trimProductId,
      transaction.trim_product ?? transaction.trim,
    ),
    percent_molding:
      transaction.percent_molding ?? transaction.molding_percent ?? null,
    molding_product_id: getProductValue(
      moldingProductId,
      transaction.molding_product ?? transaction.molding,
    ),
    percent_covering_primary:
      transaction.percent_covering_primary ??
      transaction.covering_primary_percent ??
      null,
    covering_primary_product_id: getProductValue(
      coveringPrimaryProductId,
      transaction.covering_primary_product ?? transaction.covering_primary,
    ),
    percent_covering_secondary:
      transaction.percent_covering_secondary ??
      transaction.covering_secondary_percent ??
      null,
    covering_secondary_product_id: getProductValue(
      coveringSecondaryProductId,
      transaction.covering_secondary_product ?? transaction.covering_secondary,
    ),
    percent_color:
      transaction.percent_color ?? transaction.color_percent ?? null,
    color_product_id: getProductValue(
      colorProductId,
      transaction.color_product ?? transaction.color,
    ),
    color_custom_name: transaction.color_custom_name ?? null,
    floor_skirting_length: transaction.floor_skirting_length ?? null,
    floor_skirting_product_id: getProductValue(
      floorSkirtingProductId,
      transaction.floor_skirting_product ?? transaction.floor_skirting,
    ),
    heated_floor_product_id: getProductValue(
      heatedFloorProductId,
      transaction.heated_floor_product ?? transaction.heated_floor,
    ),
    volume_heated_floor: transaction.volume_heated_floor ?? null,
    latting_product_id: getProductValue(
      lattingProductId,
      transaction.latting_product ?? transaction.latting,
    ),
    volume_latting: transaction.volume_latting ?? null,
    window_product_id: getProductValue(
      windowProductId,
      transaction.window_product ?? transaction.window,
    ),
    volume_window: transaction.volume_window ?? null,
    windowsill_product_id: getProductValue(
      windowsillProductId,
      transaction.windowsill_product ?? transaction.windowsill,
    ),
    volume_windowsill: transaction.volume_windowsill ?? null,
    glass_product_id: getProductValue(
      glassProductId,
      transaction.glass_product ?? transaction.glass,
    ),
    volume_glass: transaction.volume_glass ?? null,
    door_lock_mechanism: transaction.door_lock_mechanism ?? null,
    door_lock_product_id: getProductValue(
      doorLockProductId,
      transaction.door_lock_product ?? transaction.door_lock,
    ),
    hinge_mechanism: transaction.hinge_mechanism ?? null,
    hinge_product_id: getProductValue(
      hingeProductId,
      transaction.hinge_product ?? transaction.hinge ?? transaction.canopy,
    ),
    door_bolt_product_id: getProductValue(
      doorBoltProductId,
      transaction.door_bolt_product ??
        transaction.door_bolt ??
        transaction.latch,
    ),
    door_stopper_product_id: getProductValue(
      doorStopperProductId,
      transaction.door_stopper_product ?? transaction.door_stopper,
    ),
    anti_threshold_product_id: getProductValue(
      antiThresholdProductId,
      transaction.anti_threshold_product ?? transaction.anti_threshold,
    ),
    door_stopper_quantity: transaction.door_stopper_quantity ?? null,
    anti_threshold_quantity: transaction.anti_threshold_quantity ?? null,
    box_width: transaction.box_width ?? null,
    box_width_length: transaction.box_width_length ?? null,
    percent_extra_option: transaction.percent_extra_option ?? null,
    extra_option_product_id: getProductValue(
      extraOptionProductId,
      transaction.extra_option_product ?? transaction.extra_option,
    ),
  };
};
