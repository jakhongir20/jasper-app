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

export const renderFormItem = (field: FormFieldConfig) => {
  const { name, label, type, required, options, apiConfig } = field;
  const placeholder = t(`common.placeholder.${name}`);
  const Comp = FieldComponents[type as FieldType];
  const key = name || getRandomId("form_item_");

  // Build props for component
  const compProps: Record<string, unknown> = { placeholder };

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

  return (
    <Form.Item
      key={key}
      label={t(label)}
      name={name}
      rules={
        required
          ? [{ required: true, message: t("common.validation.required") }]
          : undefined
      }
    >
      <Comp {...compProps} />
    </Form.Item>
  );
};
