import { memo } from "react";
import { Form } from "antd";
import i18n from "@/app/i18n";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";
import { getRandomId } from "@/shared/utils";
import {
  chamferOptions,
  crownStyleOptions,
  doorTypeOptions,
  doorwayTypeOptions,
  FormFieldConfig,
  openingDirectionOptions,
  openingSideOptions,
  sashOptions,
  sheathingOptions,
  thresholdTypeOptions,
  trimStyleOptions,
  underTrimStyleOptions,
  upTrimStyleOptions,
  veenerTypeOptions,
} from "@/features/dashboard/bids";
import {
  ImageSelectPopover,
  ImageUpload,
  Input,
  NumberInput,
  Select,
  SelectInfinitive,
  TextAreaInput,
} from "@/shared/ui";

export const photoStyleOptions = [{ value: "По фото", label: "По фото" }];

const t = i18n.t;

// Map string option keys to actual option arrays
const getOptionsMap = (): Record<
  string,
  { value: string | number; label: string }[]
> => ({
  doorTypeOptions,
  veenerTypeOptions,
  doorwayTypeOptions,
  openingSideOptions,
  openingDirectionOptions,
  thresholdTypeOptions,
  chamferOptions,
  sashOptions,
  sheathingOptions,
  trimStyleOptions,
  upTrimStyleOptions,
  underTrimStyleOptions,
  crownStyleOptions,
  photoStyleOptions,
});

export const getOptions = (key: string) => getOptionsMap()[key] || [];

const ImgOption = memo(
  ({ item }: { item: { image_url?: string; name: string } }) => {
    const { getAssetUrl } = useStaticAssetsUrl();

    return (
      <div className="flex flex-col items-center p-2">
        <img
          key={getRandomId(item?.image_url)}
          src={getAssetUrl(item?.image_url || "")}
          alt={item?.name}
          className="h-48 w-48 rounded-2xl object-cover"
        />
      </div>
    );
  },
);

ImgOption.displayName = "ImgOption";

// Map field types to components
const FieldComponents = {
  input: Input,
  textarea: TextAreaInput,
  number: NumberInput,
  select: Select,
  file: ImageUpload,
  selectInfinitive: SelectInfinitive,
  image: ImageSelectPopover,
} as const;

type FieldType = FormFieldConfig["type"];

export interface RenderFormItemContext {
  doorType?: string | null;
}

// Base function that renders a form item with optional context
const renderFormItemInternal = (field: FormFieldConfig, context?: RenderFormItemContext) => {
  const { name, label, type, required, options, apiConfig, integerOnly } = field;
  const placeholder = t(`common.placeholder.${name}`);
  const Comp = FieldComponents[type as FieldType];
  const key = name || getRandomId("form_item_");

  // Build props for component
  const compProps: Record<string, unknown> = { placeholder };

  // For number fields, set floatValue based on integerOnly
  if (type === "number" && integerOnly) {
    compProps.floatValue = false;
  }

  if (type === "select" && options) {
    compProps.options = getOptions(options);
  }

  if (type === "image" && apiConfig) {
    compProps.fetchUrl = apiConfig.fetchUrl;
    compProps.valueKey = apiConfig.valueKey;
    compProps.labelKey = apiConfig.labelKey;
    compProps.params = apiConfig.params;
  }

  if (type === "selectInfinitive" && apiConfig) {
    compProps.fetchUrl = apiConfig.fetchUrl;
    compProps.valueKey = apiConfig.valueKey;
    compProps.labelKey = apiConfig.labelKey;
    compProps.params = apiConfig.params;
    compProps.queryKey =
      apiConfig.fetchUrl +
      JSON.stringify(apiConfig.params || { key: "something" });
  }

  // Dynamic required validation for box_width when door_type is ДО or ДГ
  let isRequired = required;
  if (name === "box_width" && context?.doorType) {
    isRequired = context.doorType === "ДО" || context.doorType === "ДГ";
  }

  // Build validation rules
  const rules: Array<{ required?: boolean; message?: string; validator?: (_: unknown, value: unknown) => Promise<void> }> = [];

  if (isRequired) {
    rules.push({ required: true, message: t("common.validation.required") });
  }

  // Add non-negative validation for number fields
  if (type === "number") {
    rules.push({
      validator: (_, value) => {
        if (value !== undefined && value !== null && value !== "" && Number(value) < 0) {
          return Promise.reject(new Error(t("common.validation.noNegative")));
        }
        return Promise.resolve();
      },
    });
  }

  return (
    <Form.Item
      key={key}
      label={t(label)}
      name={name}
      rules={rules.length > 0 ? rules : undefined}
    >
      <Comp {...compProps} />
    </Form.Item>
  );
};

// For use in .map() callbacks - compatible with Array.map signature
export const renderFormItem = (field: FormFieldConfig) => renderFormItemInternal(field);

// For use with context (e.g., doorType for box_width validation)
export const renderFormItemWithContext = (context: RenderFormItemContext) =>
  (field: FormFieldConfig) => renderFormItemInternal(field, context);
