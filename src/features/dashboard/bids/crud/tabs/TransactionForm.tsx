import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { Collapse, Divider, Form } from "antd";
import { cn } from "@/shared/helpers";
import { ApplicationLocalForm } from "@/features/dashboard/bids";
import { useConfigurationDetail } from "@/features/admin/settings/model/settings.queries";
import { CSwitch, Input, Select, SelectInfinitive } from "@/shared/ui";
import { ImageSelectPopover } from "@/shared/ui/popover/ImageSelectPopover";
import { SASH_OPTIONS } from "./Door2D/data/sashOptions";

// Wrapper component for ImageSelectPopover that properly handles Form.Item integration
// Form.Item injects `value` and `onChange` as props to its child component
// We need to: 1) Pass the value to ImageSelectPopover, 2) Call Form.Item's onChange with the extracted ID
interface ImageSelectPopoverFieldProps {
  value?: any; // Injected by Form.Item - can be ID (number) or full object
  onChange?: (value: any) => void; // Injected by Form.Item - we call this with extracted ID
  placeholder?: string;
  fetchUrl: string;
  params?: Record<string, unknown>;
  labelKey: string;
  imageKey?: string;
  valueKey: string;
  disabled?: boolean;
  aliases?: string[];
  setTransactionField: (fieldName: string, value: unknown) => void;
}

const ImageSelectPopoverField: FC<ImageSelectPopoverFieldProps> = ({
  value,
  onChange,
  placeholder,
  fetchUrl,
  params,
  labelKey,
  imageKey,
  valueKey,
  disabled,
  aliases,
  setTransactionField,
}) => {
  return (
    <ImageSelectPopover
      placeholder={placeholder}
      fetchUrl={fetchUrl}
      params={params}
      labelKey={labelKey}
      imageKey={imageKey}
      valueKey={valueKey}
      disabled={disabled}
      value={value}
      onChange={(item) => {
        // Extract the ID from the selected item
        const extractedId = item?.[valueKey];
        // Call Form.Item's onChange with the extracted ID (this updates form state)
        onChange?.(extractedId);
        // Also update any aliases
        if (aliases) {
          aliases.forEach((alias) => setTransactionField(alias, extractedId));
        }
      }}
    />
  );
};

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
  /** Callback when door section (Полотно) expand state changes */
  onDoorSectionToggle?: (expanded: boolean) => void;
  /** Callback when sections enabled switch changes */
  onSectionsEnabledChange?: (enabled: boolean) => void;
}

// Only include valid product types accepted by the API
// Other items like transom, frame, filler, etc. are component sections, not product types
// Exported for EditableTable
export const PRODUCT_TYPES = [
  { value: "door-window", label: "ДО дверь" },
  { value: "door-deaf", label: "ДГ дверь" },
  { value: "doorway", label: "Обшивочный проём" },
  { value: "window", label: "Окно" },
  { value: "windowsill", label: "Подоконник" },
  { value: "heated-floor", label: "Тёплый пол" },
  { value: "latting", label: "Обрешётка" },
];

const CATEGORY_SECTION_INDEX = {
  transom: 1,
  door_window: 2,
  door_deaf: 3,
  sheathing: 4,
  frame: 5,
  filler: 6,
  crown: 7,
  up_frame: 8,
  under_frame: 9,
  trim: 10,
  molding: 11,
  covering_primary: 12,
  covering_secondary: 13,
  color: 14,
  floor_skirting: 15,
  heated_floor: 16,
  latting: 17,
  window: 18,
  windowsill: 19,
  glass: 20,
  door_lock: 21,
  hinge: 22,
  door_bolt: 23,
  door_stopper: 24,
  anti_threshold: 25,
  box_width: 26,
  extra_options: 27,
} as const;

export type TransactionValues = Record<string, unknown>;

export type FieldType = "text" | "number" | "select" | "selectInfinitive" | "image";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  numberStep?: number;
  minValue?: number; // Minimum allowed value for number fields (default: 0)
  integerOnly?: boolean; // Only allow integer values
  defaultValue?: string | number; // Default value for the field when creating new transaction
  options?: { value: string | number; label: string; image?: string }[];
  queryKey?: string;
  fetchUrl?: string;
  valueKey?: string;
  labelKey?: string | string[];
  imageKey?: string;
  useValueAsLabel?: boolean;
  allowClear?: boolean;
  aliases?: string[];
  disabled?: boolean; // Field is disabled and cannot be edited by user
  params?:
    | Record<string, string | number | boolean>
    | ((
        values: TransactionValues,
        productType: string,
      ) => Record<string, string | number | boolean>);
  visible?: (values: TransactionValues, productType: string) => boolean;
};

export type SectionConfig = {
  key: string;
  title?: string;
  fields: FieldConfig[];
  visible?: (values: TransactionValues, productType: string) => boolean;
  allowedProductTypes?: string[];
};

type ProductTypeConfig = {
  requiredFields: string[];
  conditionalRequired?: Record<string, (values: TransactionValues) => boolean>;
  sections: SectionConfig[];
};

const ALWAYS_REQUIRED_FIELDS: string[] = [];

export const isDoorType = (productType: string) =>
  productType === "door-window" || productType === "door-deaf";

export const isDoorOrDoorway = (productType: string) =>
  isDoorType(productType) || productType === "doorway";

export const ALL_SECTIONS: SectionConfig[] = [
  {
    key: "transom",
    title: "Фрамуга",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      {
        name: "transom_type",
        label: "Тип фрамуги",
        type: "select",
        placeholder: "Выберите тип фрамуги",
        options: [
          { value: 1, label: "Обычная" },
          { value: 2, label: "Скрытая" },
        ],
      },
      {
        name: "transom_product_id",
        label: "Модель фрамуги",
        type: "selectInfinitive",
        placeholder: "Выберите модель фрамуги",
        queryKey: "transom_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.transom },
        labelKey: "name",
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "transom_height_front",
        label: "Высота фрамуги (лицо)",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите высоту фрамуги (лицо)",
        visible: (values) => values.transom_type === 2, // Per 2.6.6: Only visible when transom_type is "Скрытая" (Hidden)
      },
      {
        name: "transom_height_back",
        label: "Высота фрамуги (тыл)",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите высоту фрамуги (тыл)",
        visible: (values) => values.transom_type === 2, // Per 2.6.6: Only visible when transom_type is "Скрытая" (Hidden)
      },
    ],
  },
  {
    key: "sheathing",
    title: "Обшивка",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      {
        name: "sheathing_product_id",
        label: "Модель обшивки",
        type: "selectInfinitive",
        placeholder: "Выберите модель обшивки",
        queryKey: "sheathing_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.sheathing },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "door",
    title: "Полотно (дверь)",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "door_product_id",
        label: "Модель двери",
        type: "selectInfinitive",
        placeholder: "Выберите модель двери",
        queryKey: "door_product",
        fetchUrl: "/product/by/category-section-index",
        params: (_, productType) => ({
          category_section_index:
            productType === "door-deaf"
              ? CATEGORY_SECTION_INDEX.door_deaf
              : CATEGORY_SECTION_INDEX.door_window,
        }),
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "frame",
    title: "Наличник",
    allowedProductTypes: ["door-window", "door-deaf"],
    visible: (values) =>
      hasValue(values.frame_front_id) || hasValue(values.frame_back_id),
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "frame_product_id",
        label: "Модель наличника",
        type: "selectInfinitive",
        placeholder: "Выберите модель наличника",
        queryKey: "frame_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.frame },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      // Per 2.6.7: volume_frame removed
    ],
  },
  {
    key: "filler",
    title: "Нашельник",
    allowedProductTypes: ["door-window", "door-deaf"],
    visible: (values) =>
      hasValue(values.frame_front_id) || hasValue(values.frame_back_id),
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "filler_product_id",
        label: "Модель нашельника",
        type: "selectInfinitive",
        placeholder: "Выберите модель нашельника",
        queryKey: "filler_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.filler },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      // Per 2.6.7: volume_filler removed
    ],
  },
  {
    key: "crown",
    title: "Корона",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "crown_product_id",
        label: "Модель короны",
        type: "selectInfinitive",
        placeholder: "Выберите модель короны",
        queryKey: "crown_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.crown },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      // Per 2.6.7: volume_crown removed
    ],
  },
  {
    key: "up-frame",
    title: "Кубик (Надналичник)",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      {
        name: "up_frame_product_id",
        label: "Модель надналичника",
        type: "selectInfinitive",
        placeholder: "Выберите модель надналичника",
        queryKey: "up_frame_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.up_frame },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "under-frame",
    title: "Сапожок (Подналичник)",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "under_frame_product_id",
        label: "Модель подналичника",
        type: "selectInfinitive",
        placeholder: "Выберите модель подналичника",
        queryKey: "under_frame_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.under_frame },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "under_frame_height",
        label: "Высота подналичника",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите высоту подналичника",
      },
    ],
  },
  {
    key: "trim",
    title: "Обклад",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "trim_product_id",
        label: "Модель обкладки",
        type: "selectInfinitive",
        placeholder: "Выберите модель обкладки",
        queryKey: "trim_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.trim },
        labelKey: ["name", "measure"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_trim",
        label: "Процент обкладки",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент обкладки",
      },
    ],
  },
  {
    key: "molding",
    title: "Молдинг",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "molding_product_id",
        label: "Модель молдинга",
        type: "selectInfinitive",
        placeholder: "Выберите модель молдинга",
        queryKey: "molding_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.molding },
        labelKey: ["name", "measure"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_molding",
        label: "Процент молдинга",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент молдинга",
      },
    ],
  },
  {
    key: "covering-primary",
    title: "Покрытие I",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "covering_primary_product_id",
        label: "Модель покрытия I",
        type: "selectInfinitive",
        placeholder: "Выберите модель покрытия I",
        queryKey: "covering_primary_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.covering_primary,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_covering_primary",
        label: "Покрытие I, %",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент покрытия I",
      },
    ],
  },
  {
    key: "covering-secondary",
    title: "Покрытие II",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "covering_secondary_product_id",
        label: "Модель покрытия II",
        type: "selectInfinitive",
        placeholder: "Выберите модель покрытия II",
        queryKey: "covering_secondary_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.covering_secondary,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_covering_secondary",
        label: "Покрытие II, %",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент покрытия II",
      },
    ],
  },
  {
    key: "color",
    title: "Цвет",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "color_product_id",
        label: "Модель цвета",
        type: "selectInfinitive",
        placeholder: "Выберите модель цвета",
        queryKey: "color_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.color },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_color",
        label: "Цвет, %",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент цвета",
      },
      {
        name: "color_custom_name",
        label: "Название цвета",
        type: "text",
        placeholder: "Введите название цвета",
      },
    ],
  },
  {
    key: "floor-skirting",
    title: "Плинтус",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "floor_skirting_product_id",
        label: "Модель плинтуса",
        type: "selectInfinitive",
        placeholder: "Выберите модель плинтуса",
        queryKey: "floor_skirting_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.floor_skirting,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "floor_skirting_length",
        label: "Длина плинтуса",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите длину плинтуса",
      },
    ],
  },
  {
    key: "heated-floor",
    title: "Тёплый пол",
    allowedProductTypes: ["heated-floor"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "heated_floor_product_id",
        label: "Модель тёплого пола",
        type: "selectInfinitive",
        placeholder: "Выберите модель тёплого пола",
        queryKey: "heated_floor_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.heated_floor,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      // Per 2.6.7: volume_heated_floor removed
    ],
  },
  {
    key: "latting",
    title: "Обрешётка",
    allowedProductTypes: ["latting"],
    fields: [
      // Per 2.6.7: volume_latting removed
      // Per 2.6.8: Model selector first
      {
        name: "latting_product_id",
        label: "Модель обрешётки",
        type: "selectInfinitive",
        placeholder: "Выберите модель обрешётки",
        queryKey: "latting_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.latting },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "window",
    title: "Окно",
    allowedProductTypes: ["window"],
    fields: [
      // Per 2.6.7: volume_window removed
      // Per 2.6.8: Model selector first
      {
        name: "window_product_id",
        label: "Модель окна",
        type: "selectInfinitive",
        placeholder: "Выберите модель окна",
        queryKey: "window_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.window },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "windowsill",
    title: "Подоконник",
    allowedProductTypes: ["windowsill"],
    fields: [
      // Per 2.6.7: volume_windowsill removed
      // Per 2.6.8: Model selector first
      {
        name: "windowsill_product_id",
        label: "Модель подоконника",
        type: "selectInfinitive",
        placeholder: "Выберите модель подоконника",
        queryKey: "windowsill_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.windowsill },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "glass",
    title: "Стекло",
    allowedProductTypes: ["door-window", "glass"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "glass_product_id",
        label: "Модель стекла",
        type: "selectInfinitive",
        placeholder: "Выберите модель стекла",
        queryKey: "glass_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.glass },
        labelKey: ["name", "measure"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "door-lock",
    title: "Замок двери",
    allowedProductTypes: ["door-window", "door-deaf", "door_lock"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "door_lock_product_id",
        label: "Модель замка",
        type: "selectInfinitive",
        placeholder: "Выберите модель замка",
        queryKey: "door_lock_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.door_lock },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "door_lock_mechanism",
        label: "Механизм замка",
        type: "select",
        allowClear: true,
        placeholder: "Выберите механизм замка",
        options: [
          {
            value: 1,
            label: "Магнит",
          },
          {
            value: 2,
            label: "Коллектор",
          },
        ],
      },
    ],
  },
  {
    key: "hinge",
    title: "Петля",
    allowedProductTypes: ["door-window", "door-deaf", "hinge"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "hinge_product_id",
        label: "Модель петли",
        type: "selectInfinitive",
        placeholder: "Выберите модель петли",
        queryKey: "hinge_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.hinge },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "hinge_mechanism",
        label: "Механизм петли",
        type: "select",
        allowClear: true,
        placeholder: "Выберите механизм петли",
        options: [
          { value: 1, label: "Бабочка" },
          { value: 2, label: "Универсальный" },
          { value: 3, label: "Скрытый" },
        ],
      },
    ],
  },
  {
    key: "door-bolt",
    title: "Шпингалет",
    allowedProductTypes: ["door-window", "door-deaf", "door_bolt"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "door_bolt_product_id",
        label: "Модель шпингалета",
        type: "selectInfinitive",
        placeholder: "Выберите модель шпингалета",
        queryKey: "door_bolt_product",
        fetchUrl: "/product/by/category-section-index",
        params: { category_section_index: CATEGORY_SECTION_INDEX.door_bolt },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "door-stopper",
    title: "Стоппер",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "door_stopper_product_id",
        label: "Модель стоппера",
        type: "selectInfinitive",
        placeholder: "Выберите модель стоппера",
        queryKey: "door_stopper_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.door_stopper,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "anti-threshold",
    title: "Анти-порог",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "anti_threshold_product_id",
        label: "Модель анти-порога",
        type: "selectInfinitive",
        placeholder: "Выберите модель анти-порога",
        queryKey: "anti_threshold_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.anti_threshold,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
    ],
  },
  {
    key: "box-width",
    title: "Доп. длина коробки",
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      {
        name: "box_width_length",
        label: "Дополнительная длина коробки",
        type: "number",
        numberStep: 0.01,
        placeholder: "Авто-расчет",
        disabled: true, // Auto-calculated, not editable by user
      },
    ],
  },
  {
    key: "extra-options",
    title: "Доп. опция",
    allowedProductTypes: ["door-window", "door-deaf", "doorway"],
    fields: [
      // Per 2.6.8: Model selector first
      {
        name: "extra_option_product_id",
        label: "Модель доп. опции",
        type: "selectInfinitive",
        placeholder: "Выберите модель доп. опции",
        queryKey: "extra_option_product",
        fetchUrl: "/product/by/category-section-index",
        params: {
          category_section_index: CATEGORY_SECTION_INDEX.extra_options,
        },
        labelKey: ["name", "feature"],
        valueKey: "product_id",
        useValueAsLabel: true,
      },
      {
        name: "percent_extra_option",
        label: "Процент доп. опции",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите процент доп. опции",
      },
    ],
  },
];

export const getSectionsForProductType = (productType: string) =>
  ALL_SECTIONS.filter((section) => {
    if (
      !section.allowedProductTypes ||
      section.allowedProductTypes.length === 0
    ) {
      return true;
    }
    return section.allowedProductTypes.includes(productType);
  });

const resolveProductType = (values: TransactionValues) =>
  ((values.product_type ?? values.door_type) as string | undefined) ?? "";

// Required validations removed - backend handles validation
export const REQUIRED_FIELDS_BY_PRODUCT_TYPE: Record<string, string[]> = {
  "door-window": [],
  "door-deaf": [],
  doorway: [],
  window: [],
  windowsill: [],
  "heated-floor": [],
  latting: [],
};

export const hasValue = (value: unknown) =>
  value !== undefined && value !== null && value !== "";

// Conditional validations removed - backend handles validation
export const CONDITIONAL_REQUIREMENTS: Record<
  string,
  Record<string, (values: TransactionValues) => boolean>
> = {
  "door-window": {},
  "door-deaf": {},
  latting: {},
};

const PRODUCT_CONFIG: Record<string, ProductTypeConfig> = {
  "door-window": {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["door-window"],
    conditionalRequired: CONDITIONAL_REQUIREMENTS["door-window"],
    sections: getSectionsForProductType("door-window"),
  },
  "door-deaf": {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["door-deaf"],
    conditionalRequired: CONDITIONAL_REQUIREMENTS["door-deaf"],
    sections: getSectionsForProductType("door-deaf"),
  },
  doorway: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["doorway"],
    sections: getSectionsForProductType("doorway"),
  },
  window: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["window"],
    sections: getSectionsForProductType("window"),
  },
  windowsill: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["windowsill"],
    sections: getSectionsForProductType("windowsill"),
  },
  "heated-floor": {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["heated-floor"],
    sections: getSectionsForProductType("heated-floor"),
  },
  latting: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["latting"],
    conditionalRequired: CONDITIONAL_REQUIREMENTS["latting"],
    sections: getSectionsForProductType("latting"),
  },
};

export const filterVisibleSections = (
  sections: SectionConfig[],
  values: TransactionValues,
  productType: string,
) =>
  sections.filter((section) => {
    if (
      section.allowedProductTypes &&
      section.allowedProductTypes.length > 0 &&
      productType
    ) {
      if (!section.allowedProductTypes.includes(productType)) {
        return false;
      }
    }

    if (!section.visible) {
      return true;
    }

    try {
      return section.visible(values, productType);
    } catch {
      return false;
    }
  });

export const MEASUREMENT_FIELDS: FieldConfig[] = [
  // 1. location
  {
    name: "location",
    label: "Местоположение",
    type: "text",
    placeholder: "Введите местоположение",
  },
  // 2. product_type
  {
    name: "product_type",
    label: "Тип продукта",
    type: "select",
    allowClear: true,
    placeholder: "Выберите тип продукта",
    options: PRODUCT_TYPES,
    aliases: ["door_type"],
  },
  // 3. height
  {
    name: "opening_height",
    label: "Высота проёма",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите высоту проёма",
    aliases: ["height"],
  },
  // 4. width
  {
    name: "opening_width",
    label: "Ширина проёма",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите ширину проёма",
    aliases: ["width"],
  },
  // 5. thickness
  {
    name: "opening_thickness",
    label: "Толщина проёма",
    type: "number",
    numberStep: 0.01,
    defaultValue: 1,
    placeholder: "Введите толщину проёма",
    aliases: ["doorway_thickness"],
  },
  // 6. quantity
  {
    name: "entity_quantity",
    label: "Количество элементов",
    type: "number",
    numberStep: 1,
    minValue: 1,
    integerOnly: true,
    placeholder: "Введите количество элементов",
    aliases: ["quantity"],
  },
  // 7. opening_logic
  {
    name: "opening_logic",
    label: "Логика открывания",
    type: "select",
    placeholder: "Выберите логику открывания",
    options: [
      {
        value: "pull-right",
        label: "Наружное правое",
        image: "https://uat.jaspercrm.uz/static/pull-right.png",
      },
      {
        value: "push-right",
        label: "Внутреннее правое",
        image: "https://uat.jaspercrm.uz/static/push-right.png",
      },
      {
        value: "pull-left",
        label: "Наружное левое",
        image: "https://uat.jaspercrm.uz/static/pull-left.png",
      },
      {
        value: "push-left",
        label: "Внутреннее левое",
        image: "https://uat.jaspercrm.uz/static/push-left.png",
      },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
  // 8. sash
  {
    name: "sash",
    label: "Распашка",
    type: "select",
    placeholder: "Выберите распашку",
    options: SASH_OPTIONS,
    visible: (_, productType) => isDoorType(productType),
  },
  // 9. framework_front
  {
    name: "framework_front_id",
    label: "Каркас передний",
    type: "image",
    placeholder: "Выберите передний каркас",
    queryKey: "framework_front",
    fetchUrl: "/framework/all",
    params: { limit: 50 },
    labelKey: "name",
    imageKey: "image_url",
    valueKey: "framework_id",
    visible: (_, productType) => isDoorOrDoorway(productType),
  },
  // 10. framework_back
  {
    name: "framework_back_id",
    label: "Каркас задний",
    type: "image",
    placeholder: "Выберите задний каркас",
    queryKey: "framework_back",
    fetchUrl: "/framework/all",
    params: { limit: 50 },
    labelKey: "name",
    imageKey: "image_url",
    valueKey: "framework_id",
    visible: (_, productType) => isDoorOrDoorway(productType),
  },
  // 11. box_width
  {
    name: "box_width",
    label: "Ширина коробки",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите ширину коробки",
    visible: (_, productType) => isDoorType(productType),
  },
  // 12. threshold
  {
    name: "threshold",
    label: "Порог",
    type: "select",
    placeholder: "Выберите тип порога",
    options: [
      { value: "no", label: "Нет" },
      { value: "with", label: "С порогом" },
      { value: "with-low", label: "С порогом (низкий)" },
      { value: "custom", label: "Вручную" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
  // threshold_height (conditional, shows when threshold="custom")
  {
    name: "threshold_height",
    label: "Высота порога",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите высоту порога",
    visible: (values) => values.threshold === "custom",
  },
  // 13. chamfer
  {
    name: "chamfer",
    label: "Фаска",
    type: "select",
    placeholder: "Выберите фаску",
    options: [
      { value: "1", label: "Лицо" },
      { value: "2", label: "Зад" },
      { value: "3", label: "Обе стороны" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
];

export const TransactionForm: FC<Props> = ({
  className,
  mode,
  drawerOpen,
  onDoorSectionToggle,
  onSectionsEnabledChange,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
  const { data: configuration } = useConfigurationDetail();

  const transactionValues =
    (Form.useWatch(["transactions", 0], form) as TransactionValues) ??
    (form.getFieldValue(["transactions", 0]) as TransactionValues) ??
    {};

  const productType = resolveProductType(transactionValues);

  const config = productType ? PRODUCT_CONFIG[productType] : undefined;
  const [measuringActive, setMeasuringActive] = useState<string[]>([]);
  const [sectionsActive, setSectionsActive] = useState<string[]>([]);

  // Local state for immediate UI update, synced with form field
  const [sectionsEnabled, setSectionsEnabled] = useState(false);

  // Sync local state with form value when transaction loads (edit mode)
  useEffect(() => {
    const formValue = Boolean(transactionValues.allow_audition);
    if (formValue !== sectionsEnabled) {
      setSectionsEnabled(formValue);
    }
  }, [transactionValues.allow_audition]);

  const setTransactionField = (fieldName: string, value: unknown) => {
    form.setFieldValue(["transactions", 0, fieldName] as any, value);
  };

  const isFieldRequired = (fieldName: string) => {
    if (ALWAYS_REQUIRED_FIELDS.includes(fieldName)) {
      return true;
    }

    if (!config) {
      return false;
    }

    if (config.requiredFields.includes(fieldName)) {
      return true;
    }

    const conditional = config.conditionalRequired?.[fieldName];
    if (conditional) {
      try {
        return conditional(transactionValues);
      } catch {
        return false;
      }
    }

    return false;
  };

  const getRules = (fieldName: string, label: string) =>
    isFieldRequired(fieldName)
      ? [
          {
            required: true,
            message: `Заполните поле «${label}»`,
          },
        ]
      : undefined;

  useEffect(() => {
    const mappings: Array<[string, string]> = [
      ["product_type", "door_type"],
      ["opening_height", "height"],
      ["opening_width", "width"],
      ["opening_thickness", "doorway_thickness"],
      ["entity_quantity", "quantity"],
    ];

    mappings.forEach(([primary, legacy]) => {
      const primaryValue = transactionValues[primary];
      const legacyValue = transactionValues[legacy];

      if (legacyValue !== undefined && primaryValue === undefined) {
        setTransactionField(primary, legacyValue);
      }

      if (primaryValue !== undefined && primaryValue !== legacyValue) {
        setTransactionField(legacy, primaryValue);
      }
    });
  }, [form, transactionValues]);

  // 2.6.1: Auto-fill box_width from general form field (or company configuration as fallback)
  // Only auto-fill ONCE, then allow user to change/clear freely
  const [boxWidthInitialized, setBoxWidthInitialized] = useState(false);

  useEffect(() => {
    if (mode !== "add") return;
    if (boxWidthInitialized) return;

    const transactionBoxWidth = transactionValues.box_width;

    // Check for undefined, null, empty string - but NOT 0 (0 is valid value)
    const isTransactionBoxWidthEmpty =
      transactionBoxWidth === undefined ||
      transactionBoxWidth === null ||
      transactionBoxWidth === "";

    if (isTransactionBoxWidthEmpty) {
      // Priority: general form field > company configuration
      const generalBoxWidth = form.getFieldValue(["general", "box_width"]);
      const defaultBoxWidth =
        generalBoxWidth != null && generalBoxWidth !== ""
          ? generalBoxWidth
          : configuration?.standard_box_width;

      if (defaultBoxWidth != null) {
        setTransactionField("box_width", defaultBoxWidth);
        setBoxWidthInitialized(true);
      }
    }
  }, [mode, configuration?.standard_box_width, boxWidthInitialized, form]);

  // 2.6.2: Auto-fill default door lock and hinge from application defaults
  useEffect(() => {
    const defaultDoorLockId = form.getFieldValue([
      "general",
      "default_door_lock_id",
    ]);
    const defaultHingeId = form.getFieldValue(["general", "default_hinge_id"]);

    // Pre-fill door_lock_product_id if not already set
    if (defaultDoorLockId && !transactionValues.door_lock_product_id) {
      setTransactionField("door_lock_product_id", defaultDoorLockId);
    }

    // Pre-fill hinge_product_id if not already set
    if (defaultHingeId && !transactionValues.hinge_product_id) {
      setTransactionField("hinge_product_id", defaultHingeId);
    }
  }, [form, transactionValues]);

  // 2.6.5: Default entity_quantity to 1
  useEffect(() => {
    // Set default quantity to 1 if not already set
    if (!transactionValues.entity_quantity && !transactionValues.quantity) {
      setTransactionField("entity_quantity", 1);
      setTransactionField("quantity", 1);
    }
  }, [form, transactionValues]);

  // 2.6.6: Transom conditional fields - hide and clear if transom_type != "Скрытая" (Hidden = 2)
  useEffect(() => {
    const transomType = transactionValues.transom_type;

    // If transom_type is not "Скрытая" (value 2), clear height fields
    if (transomType !== 2) {
      if (transactionValues.transom_height_front) {
        setTransactionField("transom_height_front", undefined);
      }
      if (transactionValues.transom_height_back) {
        setTransactionField("transom_height_back", undefined);
      }
    }
  }, [transactionValues.transom_type, form]);

  // Auto-open "Аудит" and "Модели" collapses when drawer opens in edit mode
  useEffect(() => {
    if (drawerOpen && mode === "edit") {
      const timer = setTimeout(() => {
        setMeasuringActive(["measuring"]);
        setSectionsActive(["sections"]);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // Reset when drawer closes
      setMeasuringActive([]);
      setSectionsActive([]);
      setBoxWidthInitialized(false);
    }
  }, [drawerOpen, mode]);

  // Clear validation errors when product_type changes
  // This prevents stale "required" errors from showing on fields
  // that are no longer required for the new product type
  useEffect(() => {
    if (productType) {
      // Clear errors for opening_thickness when switching to a product type that doesn't require it
      const fieldsToRevalidate = ["opening_thickness"];
      fieldsToRevalidate.forEach((fieldName) => {
        // Reset field error by setting field status
        form.setFields([
          {
            name: ["transactions", 0, fieldName] as any,
            errors: [],
          },
        ]);
      });
    }
  }, [productType, form]);

  const renderField = (field: FieldConfig) => {
    if (field.visible && !field.visible(transactionValues, productType)) {
      return null;
    }

    const namePath = ["transactions", 0, field.name] as (string | number)[];
    const rules = getRules(field.name, field.label);
    const isFieldDisabled = field.disabled;

    switch (field.type) {
      case "text":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <Input
              placeholder={field.placeholder}
              disabled={isFieldDisabled}
              onChange={(event) => {
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, event.target.value),
                  );
                }
              }}
            />
          </Form.Item>
        );
      case "number": {
        const minVal = field.minValue ?? 0;
        const isInteger = field.integerOnly ?? false;
        return (
          <Form.Item
            name={namePath}
            label={field.label}
            rules={[
              ...(rules ?? []),
              {
                validator: (_, value) => {
                  if (value !== undefined && value !== null && value !== "") {
                    const numValue = Number(value);
                    if (isInteger && !Number.isInteger(numValue)) {
                      return Promise.reject(
                        new Error("Значение должно быть целым числом"),
                      );
                    }
                    if (numValue < minVal) {
                      return Promise.reject(
                        new Error(
                          minVal > 0
                            ? `Значение должно быть не менее ${minVal}`
                            : "Значение не может быть отрицательным",
                        ),
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min={0}
              step={field.numberStep ?? 0.01}
              placeholder={field.placeholder}
              disabled={isFieldDisabled}
              onChange={(e) => {
                const numValue = e.target.value ? Number(e.target.value) : null;
                // Sync value to aliases (e.g., opening_thickness -> doorway_thickness)
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, numValue),
                  );
                }
              }}
            />
          </Form.Item>
        );
      }
      case "select": {
        const hasImages = field.options?.some((opt) => opt.image);
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <Select
              placeholder={field.placeholder}
              options={field.options}
              allowClear={field.allowClear}
              disabled={isFieldDisabled}
              onChange={(value) => {
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, value),
                  );
                }
              }}
              optionRender={
                hasImages
                  ? (option) => {
                      const opt = field.options?.find(
                        (o) => o.value === option.value,
                      );
                      return (
                        <div className="flex items-center gap-2">
                          {opt?.image && (
                            <img
                              src={opt.image}
                              alt={opt.label}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span>{opt?.label}</span>
                        </div>
                      );
                    }
                  : undefined
              }
              labelRender={
                hasImages
                  ? (props) => {
                      const opt = field.options?.find(
                        (o) => o.value === props.value,
                      );
                      return (
                        <div className="flex items-center gap-2">
                          {opt?.image && (
                            <img
                              src={opt.image}
                              alt={opt.label}
                              className="h-5 w-5 object-contain"
                            />
                          )}
                          <span>{opt?.label}</span>
                        </div>
                      );
                    }
                  : undefined
              }
            />
          </Form.Item>
        );
      }
      case "selectInfinitive":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <SelectInfinitive
              placeholder={field.placeholder}
              queryKey={field.queryKey}
              fetchUrl={field.fetchUrl}
              disabled={isFieldDisabled}
              params={
                typeof field.params === "function"
                  ? field.params(transactionValues, productType)
                  : field.params
              }
              labelKey={field.labelKey ?? "name"}
              valueKey={(field.valueKey ?? "product_id") as string}
              useValueAsLabel={field.useValueAsLabel}
              allowClear={field.allowClear}
              onSelect={(_: string, selectedOption?: any) => {
                // Auto-fill percent/size attributes directly from the selected product
                if (!selectedOption) return;

                const autoFillMappings: Record<
                  string,
                  { field: string; sources: string[] }
                > = {
                  trim_product_id: {
                    field: "percent_trim",
                    sources: ["percent_trim", "percent", "size"],
                  },
                  molding_product_id: {
                    field: "percent_molding",
                    sources: ["percent_molding", "percent", "size"],
                  },
                  covering_primary_product_id: {
                    field: "percent_covering_primary",
                    sources: ["percent_covering_primary", "percent", "size"],
                  },
                  covering_secondary_product_id: {
                    field: "percent_covering_secondary",
                    sources: ["percent_covering_secondary", "percent", "size"],
                  },
                  color_product_id: {
                    field: "percent_color",
                    sources: ["percent_color", "percent", "size"],
                  },
                  extra_option_product_id: {
                    field: "percent_extra_option",
                    sources: ["percent_extra_option", "percent", "size"],
                  },
                  under_frame_product_id: {
                    field: "under_frame_height",
                    sources: [
                      "under_frame_height",
                      "height",
                      "percent",
                      "size",
                    ],
                  },
                };

                const mapping = autoFillMappings[field.name];
                if (!mapping) return;

                const valueFromSelected = mapping.sources
                  .map((key) => selectedOption?.[key])
                  .find((val) => val !== undefined && val !== null);

                if (valueFromSelected !== undefined) {
                  setTransactionField(mapping.field, valueFromSelected);
                }
              }}
              onChange={(value) => {
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, value),
                  );
                }
              }}
            />
          </Form.Item>
        );
      case "image":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <ImageSelectPopoverField
              placeholder={field.placeholder}
              fetchUrl={field.fetchUrl ?? ""}
              params={
                typeof field.params === "function"
                  ? field.params(transactionValues, productType)
                  : field.params
              }
              labelKey={(field.labelKey ?? "name") as string}
              imageKey={field.imageKey}
              valueKey={(field.valueKey ?? "framework_id") as string}
              disabled={isFieldDisabled}
              aliases={field.aliases}
              setTransactionField={setTransactionField}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const combinedSections = useMemo(() => {
    if (!productType) {
      return ALL_SECTIONS;
    }

    return filterVisibleSections(ALL_SECTIONS, transactionValues, productType);
  }, [transactionValues, productType]);

  // Notify parent about door section visibility (for 2D tab sash selector)
  useEffect(() => {
    const hasDoorSection = combinedSections.some((s) => s.key === "door");
    const isSectionsOpen = sectionsActive.includes("sections");
    onDoorSectionToggle?.(hasDoorSection && isSectionsOpen);
  }, [combinedSections, sectionsActive, onDoorSectionToggle]);

  const handleSectionsEnabledChange = (enabled: boolean) => {
    setSectionsEnabled(enabled); // Immediate UI update
    setTransactionField("allow_audition", enabled); // Sync to form for backend
    onSectionsEnabledChange?.(enabled);
  };

  return (
    <div className={cn(className)}>
      <Collapse
        destroyOnHidden={false}
        ghost
        activeKey={measuringActive}
        onChange={(key) => setMeasuringActive(Array.isArray(key) ? key : [key])}
      >
        <Collapse.Panel
          key="measuring"
          header={
            <div className="flex items-center gap-3">
              <span className={"font-medium !text-[#218395]"}>Замерка</span>
              <CSwitch
                checked={sectionsEnabled}
                onChange={handleSectionsEnabledChange}
                onClick={(_, e) => e.stopPropagation()}
              />
              <span className="text-gray-400">Аудит</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {MEASUREMENT_FIELDS.map((field) => {
              const node = renderField(field);
              if (!node) return null;
              return <Fragment key={field.name}>{node}</Fragment>;
            })}
          </div>
        </Collapse.Panel>
      </Collapse>

      {sectionsEnabled && (
        <>
          <Divider />

          <Collapse
            destroyOnHidden={false}
            ghost
            activeKey={sectionsActive}
            onChange={(key) =>
              setSectionsActive(Array.isArray(key) ? key : [key])
            }
          >
            <Collapse.Panel
              key="sections"
              header={
                <span className={"font-medium !text-[#218395]"}>Модели</span>
              }
            >
              {combinedSections.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
                  {combinedSections.flatMap((section) =>
                    section.fields.map((field) => {
                      const node = renderField(field);
                      if (!node) return null;
                      return (
                        <Fragment key={`${section.key}-${field.name}`}>
                          {node}
                        </Fragment>
                      );
                    }),
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {productType
                    ? "Для выбранного типа продукта дополнительных полей пока не настроено."
                    : "Выберите тип продукта для активации этапа моделирования"}
                </div>
              )}
            </Collapse.Panel>
          </Collapse>
        </>
      )}
    </div>
  );
};

export const getTransactionValidationPaths = (
  values: TransactionValues,
): (string | number)[][] => {
  const productType = resolveProductType(values);
  const config = productType ? PRODUCT_CONFIG[productType] : undefined;
  const sections = config?.sections ?? [];
  const visibleSections = filterVisibleSections(sections, values, productType);

  const names: string[] = [];

  MEASUREMENT_FIELDS.forEach((field) => {
    if (!field.visible || field.visible(values, productType)) {
      names.push(field.name);
    }
  });

  ALL_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.visible || field.visible(values, productType)) {
        names.push(field.name);
      }
    });
  });

  visibleSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.visible || field.visible(values, productType)) {
        names.push(field.name);
      }
    });
  });

  return names.map((name) => ["transactions", 0, name] as (string | number)[]);
};

const getFieldLabel = (fieldName: string): string => {
  const measurementField = MEASUREMENT_FIELDS.find((f) => f.name === fieldName);
  if (measurementField) {
    return measurementField.label;
  }

  for (const section of ALL_SECTIONS) {
    const field = section.fields.find((f) => f.name === fieldName);
    if (field) {
      return field.label;
    }
  }

  return fieldName;
};

export const getUnfilledRequiredFields = (
  values: TransactionValues,
): Array<{ name: string; label: string }> => {
  const productType = resolveProductType(values);
  const config = productType ? PRODUCT_CONFIG[productType] : undefined;

  const unfilledFields: Array<{ name: string; label: string }> = [];

  const checkField = (fieldName: string) => {
    const value = values[fieldName];
    if (!hasValue(value)) {
      unfilledFields.push({
        name: fieldName,
        label: getFieldLabel(fieldName),
      });
    }
  };

  // Always check ALWAYS_REQUIRED_FIELDS (like product_type)
  ALWAYS_REQUIRED_FIELDS.forEach(checkField);

  // If no product type selected, return early with just the always-required fields
  if (!config) {
    return unfilledFields;
  }

  config.requiredFields.forEach(checkField);

  if (config.conditionalRequired) {
    Object.entries(config.conditionalRequired).forEach(
      ([fieldName, condition]) => {
        try {
          if (condition(values)) {
            checkField(fieldName);
          }
        } catch {
          // Ignore errors in conditional checks
        }
      },
    );
  }

  return unfilledFields;
};
