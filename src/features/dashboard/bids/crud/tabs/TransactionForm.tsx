import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { Collapse, Divider, Form } from "antd";
import { cn } from "@/shared/helpers";
import { ApplicationLocalForm } from "@/features/dashboard/bids";
import { Input, Select, SelectInfinitive } from "@/shared/ui";

interface Props {
  className?: string;
  mode: "add" | "edit";
}

const PRODUCT_TYPES = [
  { value: "door-window", label: "ДО дверь" },
  { value: "door-deaf", label: "ДГ дверь" },
  { value: "doorway", label: "Обшивочный проём" },
  { value: "window", label: "Окно" },
  { value: "windowsill", label: "Подоконник" },
  { value: "heated-floor", label: "Тёплый пол" },
  { value: "latting", label: "Обрешётка" },
];

type TransactionValues = Record<string, unknown>;

type FieldType = "text" | "number" | "select" | "selectInfinitive";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  numberStep?: number;
  options?: { value: string | number; label: string }[];
  queryKey?: string;
  fetchUrl?: string;
  valueKey?: string;
  labelKey?: string | string[];
  useValueAsLabel?: boolean;
  allowClear?: boolean;
  aliases?: string[];
  visible?: (values: TransactionValues, productType: string) => boolean;
};

type SectionConfig = {
  key: string;
  title?: string;
  fields: FieldConfig[];
  visible?: (values: TransactionValues, productType: string) => boolean;
};

type ProductTypeConfig = {
  requiredFields: string[];
  conditionalRequired?: Record<string, (values: TransactionValues) => boolean>;
  sections: SectionConfig[];
};

const ALWAYS_REQUIRED_FIELDS: string[] = [];

const isDoorType = (productType: string) =>
  productType === "door-window" || productType === "door-deaf";

const resolveProductType = (values: TransactionValues) =>
  ((values.product_type ?? values.door_type) as string | undefined) ?? "";

const createDoorSections = (includeGlass: boolean): SectionConfig[] => {
  const sections: SectionConfig[] = [
    {
      key: "transom",
      title: "Фрамуга",
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
          name: "transom_height_front",
          label: "Высота фрамуги (лицо)",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите высоту фрамуги (лицо)",
        },
        {
          name: "transom_height_back",
          label: "Высота фрамуги (тыл)",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите высоту фрамуги (тыл)",
        },
        {
          name: "transom_product_id",
          label: "Модель фрамуги",
          type: "selectInfinitive",
          placeholder: "Выберите модель фрамуги",
          queryKey: "transom_product",
          fetchUrl:
            "/product/by/category-section-index?category_section_index=",
          labelKey: "name",
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "door",
      title: "Полотно (дверь)",
      fields: [
        {
          name: "door_product_id",
          label: "Модель двери",
          type: "selectInfinitive",
          placeholder: "Выберите модель двери",
          queryKey: "door_product",
          fetchUrl: "/product/by/category?category_id=11",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "sheathing",
      title: "Обшивка",
      fields: [
        {
          name: "sheathing_product_id",
          label: "Модель обшивки",
          type: "selectInfinitive",
          placeholder: "Выберите модель обшивки",
          queryKey: "sheathing_product",
          fetchUrl: "/product/by/category?category_id=12",
          labelKey: ["name", "measure"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "trim-elements",
      title: "Наличник и элементы",
      fields: [
        {
          name: "frame_product_id",
          label: "Модель наличника",
          type: "selectInfinitive",
          placeholder: "Выберите модель наличника",
          queryKey: "frame_product",
          fetchUrl: "/product/by/category?category_id=13",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "filler_product_id",
          label: "Модель нашельника",
          type: "selectInfinitive",
          placeholder: "Выберите модель нашельника",
          queryKey: "filler_product",
          fetchUrl: "/product/by/category?category_id=14",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "crown_product_id",
          label: "Модель короны",
          type: "selectInfinitive",
          placeholder: "Выберите модель короны",
          queryKey: "crown_product",
          fetchUrl: "/product/by/category?category_id=15",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
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
          fetchUrl: "/product/by/category?category_id=16",
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
        {
          name: "under_frame_product_id",
          label: "Модель подналичника",
          type: "selectInfinitive",
          placeholder: "Выберите модель подналичника",
          queryKey: "under_frame_product",
          fetchUrl: "/product/by/category?category_id=17",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "finishing",
      title: "Отделка",
      fields: [
        {
          name: "percent_trim",
          label: "Процент обкладки",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите процент обкладки",
        },
        {
          name: "trim_product_id",
          label: "Модель обкладки",
          type: "selectInfinitive",
          placeholder: "Выберите модель обкладки",
          queryKey: "trim_product",
          fetchUrl: "/product/by/category?category_id=18",
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
        {
          name: "molding_product_id",
          label: "Модель молдинга",
          type: "selectInfinitive",
          placeholder: "Выберите модель молдинга",
          queryKey: "molding_product",
          fetchUrl: "/product/by/category?category_id=19",
          labelKey: ["name", "measure"],
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
        {
          name: "covering_primary_product_id",
          label: "Модель покрытия I",
          type: "selectInfinitive",
          placeholder: "Выберите модель покрытия I",
          queryKey: "covering_primary_product",
          fetchUrl: "/product/by/category?category_id=20",
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
        {
          name: "covering_secondary_product_id",
          label: "Модель покрытия II",
          type: "selectInfinitive",
          placeholder: "Выберите модель покрытия II",
          queryKey: "covering_secondary_product",
          fetchUrl: "/product/by/category?category_id=21",
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
        {
          name: "color_product_id",
          label: "Модель цвета",
          type: "selectInfinitive",
          placeholder: "Выберите модель цвета",
          queryKey: "color_product",
          fetchUrl: "/product/by/category?category_id=22",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "additional-products",
      title: "Плинтус, тёплый пол, обрешётка, окно, подоконник",
      fields: [
        {
          name: "floor_skirting_length",
          label: "Длина плинтуса",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите длину плинтуса",
        },
        {
          name: "floor_skirting_product_id",
          label: "Модель плинтуса",
          type: "selectInfinitive",
          placeholder: "Выберите модель плинтуса",
          queryKey: "floor_skirting_product",
          fetchUrl: "/product/by/category?category_id=23",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "heated_floor_product_id",
          label: "Модель тёплого пола",
          type: "selectInfinitive",
          placeholder: "Выберите модель тёплого пола",
          queryKey: "heated_floor_product",
          fetchUrl: "/product/by/category?category_id=24",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "latting_product_id",
          label: "Модель обрешётки",
          type: "selectInfinitive",
          placeholder: "Выберите модель обрешётки",
          queryKey: "latting_product",
          fetchUrl: "/product/by/category?category_id=25",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "window_product_id",
          label: "Модель окна",
          type: "selectInfinitive",
          placeholder: "Выберите модель окна",
          queryKey: "window_product",
          fetchUrl: "/product/by/category?category_id=26",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "windowsill_product_id",
          label: "Модель подоконника",
          type: "selectInfinitive",
          placeholder: "Выберите модель подоконника",
          queryKey: "windowsill_product",
          fetchUrl: "/product/by/category?category_id=27",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
    {
      key: "glass",
      title: "Стекло",
      visible: (_, productType) => productType === "door-window",
      fields: [
        {
          name: "glass_quantity",
          label: "Количество стекол",
          type: "number",
          numberStep: 1,
          placeholder: "Введите количество стекол",
        },
        {
          name: "glass_product_id",
          label: "Модель стекла",
          type: "selectInfinitive",
          placeholder: "Выберите модель стекла",
          queryKey: "glass_product",
          fetchUrl: "/product/by/category?category_id=1",
          labelKey: ["name", "measure"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "volume_glass",
          label: "Объём стекла",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите объём стекла",
        },
      ],
    },
    {
      key: "hardware",
      title: "Фурнитура",
      fields: [
        {
          name: "door_lock_product_id",
          label: "Модель замка",
          type: "selectInfinitive",
          placeholder: "Выберите модель замка",
          queryKey: "door_lock_product",
          fetchUrl: "/product/by/category?category_id=29",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "hinge_product_id",
          label: "Модель петли",
          type: "selectInfinitive",
          placeholder: "Выберите модель петли",
          queryKey: "hinge_product",
          fetchUrl: "/product/by/category?category_id=30",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "door_bolt_product_id",
          label: "Модель шпингалета",
          type: "selectInfinitive",
          placeholder: "Выберите модель шпингалета",
          queryKey: "door_bolt_product",
          fetchUrl: "/product/by/category?category_id=31",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "door_stopper_product_id",
          label: "Модель стоппера",
          type: "selectInfinitive",
          placeholder: "Выберите модель стоппера",
          queryKey: "door_stopper_product",
          fetchUrl: "/product/by/category?category_id=32",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
        {
          name: "anti_threshold_product_id",
          label: "Модель анти-порога",
          type: "selectInfinitive",
          placeholder: "Выберите модель анти-порога",
          queryKey: "anti_threshold_product",
          fetchUrl: "/product/by/category?category_id=33",
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
          name: "hinge_quantity",
          label: "Количество петель",
          type: "number",
          numberStep: 1,
          placeholder: "Введите количество петель",
        },
        {
          name: "door_bolt_quantity",
          label: "Количество шпингалетов",
          type: "number",
          numberStep: 1,
          placeholder: "Введите количество шпингалетов",
        },
        {
          name: "door_stopper_quantity",
          label: "Количество стопперов",
          type: "number",
          numberStep: 1,
          placeholder: "Введите количество стопперов",
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
      key: "box-extra",
      title: "Ширина коробки и доп. опции",
      fields: [
        {
          name: "percent_extra_option",
          label: "Процент доп. опции",
          type: "number",
          numberStep: 0.01,
          placeholder: "Введите процент доп. опции",
        },
        {
          name: "extra_option_product_id",
          label: "Модель доп. опции",
          type: "selectInfinitive",
          placeholder: "Выберите модель доп. опции",
          queryKey: "extra_option_product",
          fetchUrl: "/product/by/category?category_id=34",
          labelKey: ["name", "feature"],
          valueKey: "product_id",
          useValueAsLabel: true,
        },
      ],
    },
  ];

  if (!includeGlass) {
    return sections.filter((section) => section.title !== "Стекло");
  }

  return sections;
};

const REQUIRED_FIELDS_BY_PRODUCT_TYPE: Record<string, string[]> = {
  "door-window": [
    "opening_height",
    "opening_width",
    "opening_thickness",
    "entity_quantity",
    "box_width",
    "door_product_id",
    "sheathing_product_id",
    "glass_product_id",
    "door_lock_product_id",
    "hinge_product_id",
    "door_bolt_product_id",
  ],
  "door-deaf": [
    "opening_height",
    "opening_width",
    "opening_thickness",
    "entity_quantity",
    "box_width",
    "door_product_id",
    "sheathing_product_id",
    "door_lock_product_id",
    "hinge_product_id",
    "door_bolt_product_id",
  ],
  doorway: [
    "opening_height",
    "opening_width",
    "opening_thickness",
    "entity_quantity",
    "sheathing_product_id",
  ],
  window: [
    "opening_height",
    "opening_width",
    "entity_quantity",
    "window_product_id",
  ],
  windowsill: [
    "opening_height",
    "opening_width",
    "entity_quantity",
    "windowsill_product_id",
  ],
  "heated-floor": [
    "opening_height",
    "opening_width",
    "entity_quantity",
    "heated_floor_product_id",
  ],
  latting: [
    "opening_height",
    "opening_width",
    "entity_quantity",
    "latting_product_id",
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
  hasValue(values.framework_front_id);

const lattingHasBack = (values: TransactionValues) =>
  hasValue(values.framework_back_id);

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
  },
  "door-deaf": {
    door_bolt_product_id: (values) =>
      Number(values?.opening_width ?? values?.width ?? 0) >= 1.1,
  },
  latting: {
    framework_front_id: lattingHasFront,
    framework_back_id: lattingHasBack,
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
    sections: createDoorSections(true),
  },
  "door-deaf": {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["door-deaf"],
    conditionalRequired: CONDITIONAL_REQUIREMENTS["door-deaf"],
    sections: createDoorSections(false),
  },
  doorway: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["doorway"],
    sections: [
      {
        key: "doorway-sheathing",
        title: "Обшивка",
        fields: [
          {
            name: "sheathing_product_id",
            label: "Модель обшивки",
            type: "selectInfinitive",
            placeholder: "Выберите модель обшивки",
            queryKey: "doorway_sheathing",
            fetchUrl: "/product/by/category?category_id=13",
            labelKey: ["name", "measure"],
            valueKey: "product_id",
            useValueAsLabel: true,
          },
        ],
      },
    ],
  },
  window: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["window"],
    sections: [
      {
        key: "window-main",
        title: "Окно",
        fields: [
          {
            name: "window_product_id",
            label: "Модель окна",
            type: "selectInfinitive",
            placeholder: "Выберите модель окна",
            queryKey: "window_product",
            fetchUrl: "/product/by/category?category_id=26",
            labelKey: ["name", "feature"],
            valueKey: "product_id",
            useValueAsLabel: true,
          },
        ],
      },
    ],
  },
  windowsill: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["windowsill"],
    sections: [
      {
        key: "windowsill-main",
        title: "Подоконник",
        fields: [
          {
            name: "windowsill_product_id",
            label: "Модель подоконника",
            type: "selectInfinitive",
            placeholder: "Выберите модель подоконника",
            queryKey: "windowsill_product",
            fetchUrl: "/product/by/category?category_id=27",
            labelKey: ["name", "feature"],
            valueKey: "product_id",
            useValueAsLabel: true,
          },
        ],
      },
    ],
  },
  "heated-floor": {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["heated-floor"],
    sections: [
      {
        key: "heated-floor-main",
        title: "Тёплый пол",
        fields: [
          {
            name: "heated_floor_product_id",
            label: "Модель тёплого пола",
            type: "selectInfinitive",
            placeholder: "Выберите модель тёплого пола",
            queryKey: "heated_floor_product",
            fetchUrl: "/product/by/category?category_id=24",
            labelKey: ["name", "feature"],
            valueKey: "product_id",
            useValueAsLabel: true,
          },
        ],
      },
    ],
  },
  latting: {
    requiredFields: REQUIRED_FIELDS_BY_PRODUCT_TYPE["latting"],
    conditionalRequired: CONDITIONAL_REQUIREMENTS["latting"],
    sections: [
      {
        key: "latting-main",
        title: "Обрешётка",
        fields: [
          {
            name: "latting_product_id",
            label: "Модель обрешётки",
            type: "selectInfinitive",
            placeholder: "Выберите модель обрешётки",
            queryKey: "latting_product",
            fetchUrl: "/product/by/category?category_id=25",
            labelKey: ["name", "feature"],
            valueKey: "product_id",
            useValueAsLabel: true,
          },
        ],
      },
    ],
  },
};

const filterVisibleSections = (
  sections: SectionConfig[],
  values: TransactionValues,
  productType: string,
) =>
  sections.filter(
    (section) => !section.visible || section.visible(values, productType),
  );

const MEASUREMENT_FIELDS: FieldConfig[] = [
  {
    name: "location",
    label: "Местоположение",
    type: "text",
    placeholder: "Введите местоположение",
  },
  {
    name: "product_type",
    label: "Тип продукта",
    type: "select",
    allowClear: true,
    placeholder: "Выберите тип продукта",
    options: PRODUCT_TYPES,
    aliases: ["door_type"],
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
    placeholder: "Введите толщину проёма",
    aliases: ["doorway_thickness"],
  },
  {
    name: "entity_quantity",
    label: "Количество элементов",
    type: "number",
    numberStep: 1,
    placeholder: "Введите количество элементов",
    aliases: ["quantity"],
  },
  {
    name: "box_width",
    label: "Ширина коробки",
    type: "number",
    numberStep: 0.01,
    placeholder: "Введите ширину коробки",
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "framework_front_id",
    label: "Каркас передний",
    type: "selectInfinitive",
    placeholder: "Выберите передний каркас",
    queryKey: "framework_front",
    fetchUrl: "/framework/all",
    labelKey: "name",
    valueKey: "framework_id",
    useValueAsLabel: true,
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "framework_back_id",
    label: "Каркас задний",
    type: "selectInfinitive",
    placeholder: "Выберите задний каркас",
    queryKey: "framework_back",
    fetchUrl: "/framework/all",
    labelKey: "name",
    valueKey: "framework_id",
    useValueAsLabel: true,
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "threshold",
    label: "Порог",
    type: "select",
    placeholder: "Выберите тип порога",
    options: [
      { value: "yes", label: "Да" },
      { value: "no", label: "Нет" },
      { value: "custom", label: "Кастомный" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
  {
    name: "opening_logic",
    label: "Логика открывания",
    type: "select",
    placeholder: "Выберите логику открывания",
    options: [
      { value: "left", label: "Левое" },
      { value: "right", label: "Правое" },
      { value: "up", label: "Вверх" },
      { value: "down", label: "Вниз" },
    ],
    visible: (_, productType) => isDoorType(productType),
  },
];

export const TransactionForm: FC<Props> = ({ className }) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  const transactionValues =
    (Form.useWatch(["transactions", 0], form) as TransactionValues) ??
    (form.getFieldValue(["transactions", 0]) as TransactionValues) ??
    {};

  const productType = resolveProductType(transactionValues);

  const config = productType ? PRODUCT_CONFIG[productType] : undefined;
  const sections = useMemo(() => config?.sections ?? [], [config]);
  const [activeSectionKeys, setActiveSectionKeys] = useState<string[]>([]);

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

  const renderField = (field: FieldConfig) => {
    if (field.visible && !field.visible(transactionValues, productType)) {
      return null;
    }

    const namePath = ["transactions", 0, field.name] as (string | number)[];
    const rules = getRules(field.name, field.label);

    switch (field.type) {
      case "text":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <Input
              placeholder={field.placeholder}
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
      case "number":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <Input
              type="number"
              step={field.numberStep ?? 0.01}
              placeholder={field.placeholder}
              onChange={(event) => {
                const rawValue = event.target.value;
                const normalized =
                  rawValue === "" ? undefined : Number(rawValue);
                if (field.aliases) {
                  field.aliases.forEach((alias) =>
                    setTransactionField(alias, normalized),
                  );
                }
              }}
            />
          </Form.Item>
        );
      case "select":
        return (
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <Select
              placeholder={field.placeholder}
              options={field.options}
              allowClear={field.allowClear}
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
          <Form.Item name={namePath} label={field.label} rules={rules}>
            <SelectInfinitive
              placeholder={field.placeholder}
              queryKey={field.queryKey}
              fetchUrl={field.fetchUrl}
              labelKey={field.labelKey ?? "name"}
              valueKey={(field.valueKey ?? "product_id") as string}
              useValueAsLabel={field.useValueAsLabel}
              allowClear={field.allowClear}
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
      default:
        return null;
    }
  };

  const visibleSections = useMemo(
    () => filterVisibleSections(sections, transactionValues, productType),
    [sections, transactionValues, productType],
  );

  useEffect(() => {
    const initialKeys = visibleSections.map((section) => section.key);
    setActiveSectionKeys(initialKeys);
  }, [visibleSections, productType]);

  return (
    <div className={cn(className)}>
      <Collapse ghost defaultActiveKey={["measuring"]}>
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
        {visibleSections.length ? (
          visibleSections.map((section) => {
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
                    if (open) {
                      return Array.from(new Set([...prev, section.key]));
                    }
                    return prev.filter((value) => value !== section.key);
                  });
                }}
                expandIconPosition="end"
                accordion
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
          })
        ) : (
          <div className="text-sm text-gray-500">
            {productType
              ? "Для выбранного типа продукта дополнительных полей пока не настроено."
              : "Выберите тип продукта, чтобы увидеть дополнительные параметры."}
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

  visibleSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.visible || field.visible(values, productType)) {
        names.push(field.name);
      }
    });
  });

  return names.map((name) => ["transactions", 0, name] as (string | number)[]);
};
