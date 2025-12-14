import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { Collapse, Divider, Form } from "antd";
import { cn } from "@/shared/helpers";
import { ApplicationLocalForm } from "@/features/dashboard/bids";
import { CSwitch, Input, Select, SelectInfinitive } from "@/shared/ui";
import { ImageSelectPopover } from "@/shared/ui/popover/ImageSelectPopover";

interface Props {
  className?: string;
  mode: "add" | "edit";
  drawerOpen?: boolean;
}

// Only include valid product types accepted by the API
// Other items like transom, frame, filler, etc. are component sections, not product types
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

type TransactionValues = Record<string, unknown>;

type FieldType = "text" | "number" | "select" | "selectInfinitive" | "image";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  numberStep?: number;
  minValue?: number; // Minimum allowed value for number fields (default: 0)
  integerOnly?: boolean; // Only allow integer values
  options?: { value: string | number; label: string }[];
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

type SectionConfig = {
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

const ALWAYS_REQUIRED_FIELDS: string[] = ["product_type"];

const isDoorType = (productType: string) =>
  productType === "door-window" || productType === "door-deaf";

const ALL_SECTIONS: SectionConfig[] = [
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
      {
        name: "sash",
        label: "Распашка",
        type: "select",
        placeholder: "Выберите распашку",
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
        ],
      },
      {
        name: "chamfer",
        label: "Фаска",
        type: "select",
        placeholder: "Выберите фаску",
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
        ],
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
    allowedProductTypes: ["door-window", "door-deaf"],
    fields: [
      {
        name: "up_frame_quantity",
        label: "Количество надналичников",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество надналичников",
      },
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
        name: "under_frame_quantity",
        label: "Количество подналичников",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество подналичников",
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
    allowedProductTypes: ["door-window", "door-deaf"],
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
      {
        name: "glass_quantity",
        label: "Количество стекол",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество стекол",
      },
      // Per 2.6.7: volume_glass removed
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
        name: "door_lock_quantity",
        label: "Количество замков",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество замков",
      },
      {
        name: "door_lock_mechanism",
        label: "Механизм замка",
        type: "select",
        allowClear: true,
        placeholder: "Выберите механизм замка",
        options: [],
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
        name: "hinge_quantity",
        label: "Количество петель",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество петель",
      },
      {
        name: "hinge_mechanism",
        label: "Механизм петли",
        type: "select",
        allowClear: true,
        placeholder: "Выберите механизм петли",
        options: [],
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
      {
        name: "door_bolt_quantity",
        label: "Количество шпингалетов",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество шпингалетов",
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
      {
        name: "door_stopper_quantity",
        label: "Количество стопперов",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество стопперов",
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
      {
        name: "anti_threshold_quantity",
        label: "Количество анти-порогов",
        type: "number",
        numberStep: 1,
        placeholder: "Введите количество анти-порогов",
      },
    ],
  },
  {
    key: "box-width",
    title: "Ширина коробки",
    allowedProductTypes: ["box_width"],
    fields: [
      {
        name: "box_width",
        label: "Ширина коробки",
        type: "number",
        numberStep: 0.01,
        placeholder: "Введите ширина коробки",
        disabled: false, // Changed: box_width is now editable, auto-filled from company_configuration but can be manually overridden
      },
      {
        name: "box_width_length",
        label: "Длина коробки",
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
    allowedProductTypes: ["door-window", "door-deaf"],
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

const getSectionsForProductType = (productType: string) =>
  ALL_SECTIONS.filter((section) => {
    if (
      !section.allowedProductTypes ||
      section.allowedProductTypes.length === 0
    ) {
      return true;
    }
    return section.allowedProductTypes.includes(productType);
  });

const DEFAULT_PRODUCT_SECTIONS: SectionConfig[] = ALL_SECTIONS;

const resolveProductType = (values: TransactionValues) =>
  ((values.product_type ?? values.door_type) as string | undefined) ?? "";

const REQUIRED_FIELDS_BY_PRODUCT_TYPE: Record<string, string[]> = {
  "door-window": [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.1
    "box_width", // Ширина коробки
    "door_product_id", // Модель двери
    "glass_product_id", // Модель стекла
    "door_lock_product_id", // Модель замка
    "hinge_product_id", // Модель петель
    "door_bolt_product_id", // Модель шпингалета
    "sheathing_product_id", // Модель обшивки
    "frame_product_id", // Модель наличника
  ],
  "door-deaf": [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.2
    // Same as door-window except NO glass_product_id
    "box_width", // Ширина коробки
    "door_product_id", // Модель двери
    "door_lock_product_id", // Модель замка
    "hinge_product_id", // Модель петель
    "door_bolt_product_id", // Модель шпингалета
    "sheathing_product_id", // Модель обшивки
    "frame_product_id", // Модель наличника
  ],
  doorway: [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.3
    "sheathing_product_id", // Модель обшивки
  ],
  window: [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.4
    "window_product_id", // Модель окна
  ],
  windowsill: [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.5
    "windowsill_product_id", // Модель подоконника
  ],
  "heated-floor": [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.6
    "heated_floor_product_id", // Модель тёплого пола
  ],
  latting: [
    // Measurement fields (required for all)
    "opening_height",
    "opening_width",
    "entity_quantity",
    // Required modelling fields per 2.4.7
    "latting_product_id", // Модель обрешётки
  ],
};

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && value !== "";

const toBoolean = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
};

const getNestedValue = (values: TransactionValues, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, values);

const lattingHasFront = (values: TransactionValues) =>
  hasValue(values.frame_front_id);

const lattingHasBack = (values: TransactionValues) =>
  hasValue(values.frame_back_id);

const lattingFrontFlag = (values: TransactionValues, flag: string) =>
  toBoolean(getNestedValue(values, `frame_front.${flag}`));

const lattingBackFlag = (values: TransactionValues, flag: string) =>
  toBoolean(getNestedValue(values, `frame_back.${flag}`));

const CONDITIONAL_REQUIREMENTS: Record<
  string,
  Record<string, (values: TransactionValues) => boolean>
> = {
  "door-window": {
    door_bolt_product_id: (values) =>
      Number(values?.opening_width ?? values?.width ?? 0) >= 1.1,
    // Frame/Decor Logic per 2.5.1: If frame_front_id or frame_back_id selected,
    // decorative components become conditionally required based on frame flags
    up_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_up_frame") ||
      lattingBackFlag(values, "has_up_frame"),
    under_frame_height: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    under_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    crown_product_id: (values) =>
      lattingFrontFlag(values, "has_crown") ||
      lattingBackFlag(values, "has_crown"),
    transom_type: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    transom_height_front: (values) => lattingFrontFlag(values, "has_transom"),
    transom_height_back: (values) => lattingBackFlag(values, "has_transom"),
    transom_product_id: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    frame_product_id: (values) =>
      lattingFrontFlag(values, "is_frame") ||
      lattingBackFlag(values, "is_frame"),
    filler_product_id: (values) =>
      lattingFrontFlag(values, "is_filler") ||
      lattingBackFlag(values, "is_filler"),
  },
  "door-deaf": {
    door_bolt_product_id: (values) =>
      Number(values?.opening_width ?? values?.width ?? 0) >= 1.1,
    // Frame/Decor Logic per 2.5.1: If frame_front_id or frame_back_id selected,
    // decorative components become conditionally required based on frame flags
    up_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_up_frame") ||
      lattingBackFlag(values, "has_up_frame"),
    under_frame_height: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    under_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    crown_product_id: (values) =>
      lattingFrontFlag(values, "has_crown") ||
      lattingBackFlag(values, "has_crown"),
    transom_type: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    transom_height_front: (values) => lattingFrontFlag(values, "has_transom"),
    transom_height_back: (values) => lattingBackFlag(values, "has_transom"),
    transom_product_id: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    frame_product_id: (values) =>
      lattingFrontFlag(values, "is_frame") ||
      lattingBackFlag(values, "is_frame"),
    filler_product_id: (values) =>
      lattingFrontFlag(values, "is_filler") ||
      lattingBackFlag(values, "is_filler"),
  },
  latting: {
    frame_front_id: lattingHasFront,
    frame_back_id: lattingHasBack,
    up_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_up_frame") ||
      lattingBackFlag(values, "has_up_frame"),
    under_frame_height: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    under_frame_product_id: (values) =>
      lattingFrontFlag(values, "has_under_frame") ||
      lattingBackFlag(values, "has_under_frame"),
    crown_product_id: (values) =>
      lattingFrontFlag(values, "has_crown") ||
      lattingBackFlag(values, "has_crown"),
    transom_type: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    transom_height_front: (values) => lattingFrontFlag(values, "has_transom"),
    transom_height_back: (values) => lattingBackFlag(values, "has_transom"),
    transom_product_id: (values) =>
      lattingFrontFlag(values, "has_transom") ||
      lattingBackFlag(values, "has_transom"),
    frame_product_id: (values) =>
      lattingFrontFlag(values, "is_frame") ||
      lattingBackFlag(values, "is_frame"),
    filler_product_id: (values) =>
      lattingFrontFlag(values, "is_filler") ||
      lattingBackFlag(values, "is_filler"),
  },
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

const filterVisibleSections = (
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

const MEASUREMENT_FIELDS: FieldConfig[] = [
  {
    name: "location",
    label: "Местоположение",
    type: "selectInfinitive", // Per 2.6.4: Auto-suggest with Locations API
    placeholder: "Выберите местоположение",
    queryKey: "location",
    fetchUrl: "/location/all",
    labelKey: "name",
    valueKey: "location_id",
    useValueAsLabel: true,
    allowClear: true,
    // Note: params with query will be added dynamically in renderField based on search term
  },
  {
    name: "product_type",
    label: "Тип продукта",
    type: "select",
    allowClear: false,
    placeholder: "Выберите тип продукта",
    options: PRODUCT_TYPES,
    aliases: ["door_type"],
  },
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
  {
    name: "opening_height",
    label: "Высота проёма",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите высоту проёма",
    aliases: ["height"],
  },
  {
    name: "opening_width",
    label: "Ширина проёма",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите ширину проёма",
    aliases: ["width"],
  },
  {
    name: "opening_thickness",
    label: "Толщина проёма",
    type: "number",
    numberStep: 0.01,
    minValue: 0.01, // Thickness cannot be zero
    placeholder: "Введите толщину проёма",
    aliases: ["doorway_thickness"],
  },
  {
    name: "frame_front_id",
    label: "Каркас передний",
    type: "image",
    placeholder: "Выберите передний каркас",
    queryKey: "framework_front",
    fetchUrl: "/framework/all",
    labelKey: "name",
    imageKey: "image_url",
    valueKey: "framework_id",
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "frame_back_id",
    label: "Каркас задний",
    type: "image",
    placeholder: "Выберите задний каркас",
    queryKey: "framework_back",
    fetchUrl: "/framework/all",
    labelKey: "name",
    imageKey: "image_url",
    valueKey: "framework_id",
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "threshold",
    label: "Порог",
    type: "select",
    placeholder: "Выберите тип порога",
    options: [
      { value: "no", label: "Нет" },
      { value: "with", label: "С порогом" },
      { value: "with-low", label: "С порогом (низкий)" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "opening_logic",
    label: "Логика открывания",
    type: "select",
    placeholder: "Выберите логику открывания",
    options: [
      { value: "pull-right", label: "Наружное правое" },
      { value: "push-right", label: "Внутреннее правое" },
      { value: "pull-left", label: "Наружное левое" },
      { value: "push-left", label: "Внутреннее левое" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
];

export const TransactionForm: FC<Props> = ({ className, mode, drawerOpen }) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  const transactionValues =
    (Form.useWatch(["transactions", 0], form) as TransactionValues) ??
    (form.getFieldValue(["transactions", 0]) as TransactionValues) ??
    {};

  const productType = resolveProductType(transactionValues);

  const config = productType ? PRODUCT_CONFIG[productType] : undefined;
  const sections = useMemo(() => config?.sections ?? [], [config]);
  const [activeSectionKeys, setActiveSectionKeys] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState<string>(""); // Per 2.6.4: Track location search term
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [measuringActive, setMeasuringActive] = useState<string[]>([]);

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

  // 2.6.1: Auto-fill box_width from company_configuration (application general form)
  useEffect(() => {
    const generalBoxWidth = form.getFieldValue(["general", "box_width"]);
    const transactionBoxWidth = transactionValues.box_width;

    // Auto-fill box_width if it's not set and general box_width exists
    if (generalBoxWidth && !transactionBoxWidth) {
      setTransactionField("box_width", generalBoxWidth);
    }

    // Keep transaction box_width in sync with general box_width
    if (generalBoxWidth && generalBoxWidth !== transactionBoxWidth) {
      setTransactionField("box_width", generalBoxWidth);
    }
  }, [form, transactionValues]);

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

  // Auto-open "Замерка" collapse and expand all sections when drawer opens in edit mode
  useEffect(() => {
    if (drawerOpen && mode === "edit") {
      const timer = setTimeout(() => {
        setMeasuringActive(["measuring"]);
        setExpandAll(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // Reset when drawer closes
      setMeasuringActive([]);
      setExpandAll(false);
      setActiveSectionKeys([]);
    }
  }, [drawerOpen, mode]);

  const renderField = (field: FieldConfig) => {
    if (field.visible && !field.visible(transactionValues, productType)) {
      return null;
    }

    const namePath = ["transactions", 0, field.name] as (string | number)[];
    const rules = getRules(field.name, field.label);

    // Fields that should be disabled in edit mode
    // Note: Only quantity fields are disabled, model selectors remain enabled
    const disabledInEditFields = [
      "under_frame_quantity",
      "under_frame_height",
      "up_frame_quantity",
      "glass_quantity",
      "door_lock_quantity",
      "hinge_quantity",
      "door_bolt_quantity",
    ];
    const isDisabledInEdit =
      mode === "edit" && disabledInEditFields.includes(field.name);
    const isFieldDisabled = field.disabled || isDisabledInEdit;

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
              min={minVal}
              step={field.numberStep ?? 0.01}
              placeholder={field.placeholder}
              disabled={isFieldDisabled}
              onChange={(event) => {
                const rawValue = event.target.value;
                let numValue = Number(rawValue);
                // Round to integer if integerOnly
                if (isInteger && rawValue !== "") {
                  numValue = Math.round(numValue);
                }
                // Prevent values below minimum
                const normalized =
                  rawValue === ""
                    ? undefined
                    : numValue < minVal
                      ? minVal
                      : numValue;
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, normalized),
                  );
                }
              }}
            />
          </Form.Item>
        );
      }
      case "select":
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
            />
          </Form.Item>
        );
      case "selectInfinitive":
        return (
          <Form.Item
            name={namePath}
            label={field.label}
            rules={rules}
            getValueFromEvent={(value) => {
              // Extract just the ID value for location field
              if (field.name === "location" && typeof value === "object") {
                return value?.[field.valueKey ?? "location_id"];
              }
              return value;
            }}
          >
            <SelectInfinitive
              placeholder={field.placeholder}
              queryKey={field.queryKey}
              fetchUrl={field.fetchUrl}
              disabled={isFieldDisabled}
              params={
                // Per 2.6.4: For location field, add query param for search
                field.name === "location"
                  ? { query: locationSearch }
                  : typeof field.params === "function"
                    ? field.params(transactionValues, productType)
                    : field.params
              }
              labelKey={field.labelKey ?? "name"}
              valueKey={(field.valueKey ?? "product_id") as string}
              useValueAsLabel={field.useValueAsLabel}
              allowClear={field.allowClear}
              onSearch={
                // Per 2.6.4: For location field, handle search input
                field.name === "location"
                  ? (search: string) => setLocationSearch(search)
                  : undefined
              }
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
          <Form.Item
            name={namePath}
            label={field.label}
            rules={rules}
            getValueFromEvent={(item) => {
              return item?.[field.valueKey ?? "framework_id"];
            }}
          >
            <ImageSelectPopover
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
              onChange={(item) => {
                const value = item?.[field.valueKey ?? "framework_id"];
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, value),
                  );
                }
              }}
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

  // Auto-expand all sections when expandAll becomes true
  useEffect(() => {
    if (expandAll) {
      const allKeys = combinedSections.map((section) => section.key);
      setActiveSectionKeys(allKeys);
    }
  }, [expandAll, combinedSections]);

  const handleExpandAllToggle = (checked: boolean) => {
    setExpandAll(checked);
    if (checked) {
      // Open all sections
      const allKeys = combinedSections.map((section) => section.key);
      setActiveSectionKeys(allKeys);
    } else {
      // Close all sections
      setActiveSectionKeys([]);
    }
  };

  return (
    <div className={cn(className)}>
      <Collapse
        ghost
        activeKey={measuringActive}
        onChange={(key) => setMeasuringActive(Array.isArray(key) ? key : [key])}
      >
        <Collapse.Panel
          key="measuring"
          header={
            <span className={"font-medium !text-[#218395]"}>Замерка</span>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEASUREMENT_FIELDS.map((field) => {
              const node = renderField(field);
              if (!node) return null;
              return <Fragment key={field.name}>{node}</Fragment>;
            })}
          </div>
        </Collapse.Panel>
      </Collapse>

      <Divider />

      <div className="space-y-4">
        <div className="mb-4 flex items-center gap-2">
          <CSwitch checked={expandAll} onChange={handleExpandAllToggle} />
          <span className="text-sm text-gray-400">
            {expandAll ? "Свернуть все секции" : "Развернуть все секции"}
          </span>
        </div>
        {combinedSections.map((section) => {
          const isActive = activeSectionKeys.includes(section.key);
          return (
            <Collapse
              key={section.key}
              activeKey={isActive ? [section.key] : []}
              onChange={(key) => {
                const open = Array.isArray(key)
                  ? key.includes(section.key)
                  : key === section.key;
                setActiveSectionKeys((prev) => {
                  const newKeys = open
                    ? Array.from(new Set([...prev, section.key]))
                    : prev.filter((value) => value !== section.key);

                  // Update expandAll state based on whether all sections are open
                  setExpandAll(newKeys.length === combinedSections.length);

                  return newKeys;
                });
              }}
              expandIconPosition="end"
            >
              <Collapse.Panel
                header={
                  <p className={"!text-medium !text-[#218395]"}>
                    {section.title ?? "Параметры"}
                  </p>
                }
                key={section.key}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field) => {
                    const node = renderField(field);
                    if (!node) return null;
                    return (
                      <Fragment key={`${section.key}-${field.name}`}>
                        {node}
                      </Fragment>
                    );
                  })}
                </div>
              </Collapse.Panel>
            </Collapse>
          );
        })}

        {combinedSections.length === 0 && (
          <div className="text-sm text-gray-500">
            {productType
              ? "Для выбранного типа продукта дополнительных полей пока не настроено."
              : "Выберите тип продукта для активации этапа моделирования"}
          </div>
        )}
      </div>
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
