import { FC } from "react";
import { cn } from "@/shared/helpers";
import { Collapse, Divider, Form } from "antd";
import { ApplicationLocalForm } from "@/features/dashboard/bids";
import { Input, Select, SelectInfinitive } from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  mode: "add" | "edit";
}

const PRODUCT_TYPES = [
  { value: "door-window", label: "ДО Дверь" },
  { value: "door-deaf", label: "ДГ Дверь" },
  { value: "doorway", label: "Обшивочный проем" },
  { value: "window", label: "Окно" },
  { value: "windowsill", label: "Подоконник" },
  { value: "heated-floor", label: "Теплый пол" },
  { value: "latting", label: "Обрешетка" },
];

// ключи, которые уже реализованы в секции "Замерка"
const MEASUREMENT_KEYS = new Set<string>([
  "location",
  "product_type",
  "opening_height",
  "opening_width",
  "opening_thickness",
  "entity_quantity",
  "framework_front_id",
  "framework_back_id",
  "threshold",
  "opening_logic",
]);

// простенький генератор подписи по ключу (можешь потом заменить на i18n/словарь)
const prettifyKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

export const TransactionForm: FC<Props> = ({ className, mode }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ApplicationLocalForm>();

  // схема полей (у тебя потом придёт с бэка, сейчас заглушка)
  const application_transactions = [
    {
      location: "string",
      product_type: "string",
      opening_height: 0,
      opening_width: 0,
      opening_thickness: 0,
      entity_quantity: 0,
      framework_front_id: 0,
      framework_back_id: 0,
      threshold: "string",
      opening_logic: "string",
      sash: 0,
      chamfer: 0,
      transom_type: 0,
      transom_product_id: 0,
      transom_height_front: 0,
      transom_height_back: 0,
      door_product_id: 0,
      sheathing_product_id: 0,
      frame_product_id: 0,
      filler_product_id: 0,
      crown_product_id: 0,
      up_frame_quantity: 0,
      up_frame_product_id: 0,
      under_frame_quantity: 0,
      under_frame_height: 0,
      under_frame_product_id: 0,
      percent_trim: 0,
      trim_product_id: 0,
      percent_molding: 0,
      molding_product_id: 0,
      percent_covering_primary: 0,
      covering_primary_product_id: 0,
      percent_covering_secondary: 0,
      covering_secondary_product_id: 0,
      percent_color: 0,
      color_product_id: 0,
      color_custom_name: "string",
      floor_skirting_length: 0,
      floor_skirting_product_id: 0,
      heated_floor_product_id: 0,
      windowsill_product_id: 0,
      latting_product_id: 0,
      window_product_id: 0,
      glass_product_id: 0,
      volume_glass: 0,
      door_lock_mechanism: 0,
      door_lock_product_id: 0,
      hinge_mechanism: 0,
      hinge_product_id: 0,
      door_bolt_product_id: 0,
      door_stopper_quantity: 0,
      door_stopper_product_id: 0,
      anti_threshold_quantity: 0,
      anti_threshold_product_id: 0,
      box_width: 0,
      percent_extra_option: 0,
      extra_option_product_id: 0,
    },
  ];

  // берём "форму" первой транзакции
  const transactionShape = application_transactions[0] ?? {};

  // все ключи, которые НЕ реализованы в "Замерка"
  const otherParamsEntries = Object.entries(transactionShape).filter(
    ([key]) => !MEASUREMENT_KEYS.has(key),
  );

  return (
    <div className={cn(className)}>
      <Select
        options={PRODUCT_TYPES}
        value={form.getFieldValue(["transactions", 0, "door_type"])}
        className="mb-5"
        onChange={(value) =>
          form.setFieldValue(["transactions", 0, "door_type"], value)
        }
        title="Тип продукта"
        placeholder="Выберите тип продукта"
      />

      {/* ===== Замерка ===== */}
      <Collapse ghost defaultActiveKey={"1"}>
        <Collapse.Panel key={"1"} header={"Замерка"}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Location - Text input */}
            <Form.Item
              name={["transactions", 0, "location"]}
              label="Местоположение"
              rules={[{ required: true }]}
            >
              <Input placeholder="Введите местоположение" />
            </Form.Item>

            {/* Product Type - Select */}
            <Form.Item
              name={["transactions", 0, "door_type"]}
              label="Тип продукта"
              rules={[{ required: true }]}
            >
              <Select
                options={PRODUCT_TYPES}
                placeholder="Выберите тип продукта"
              />
            </Form.Item>

            {/* Opening Height - Number float */}
            <Form.Item
              name={["transactions", 0, "height"]}
              label="Высота проема"
              rules={[{ required: true }]}
            >
              <Input
                type="number"
                step="0.01"
                placeholder="Введите высоту проема"
              />
            </Form.Item>

            {/* Opening Width - Number float */}
            <Form.Item
              name={["transactions", 0, "width"]}
              label="Ширина проема"
              rules={[{ required: true }]}
            >
              <Input
                type="number"
                step="0.01"
                placeholder="Введите ширину проема"
              />
            </Form.Item>

            {/* Opening Thickness - Number float */}
            <Form.Item
              name={["transactions", 0, "doorway_thickness"]}
              label="Толщина проема"
              rules={[{ required: true }]}
            >
              <Input
                type="number"
                step="0.01"
                placeholder="Введите толщину проема"
              />
            </Form.Item>

            {/* Entity Quantity - Number int */}
            <Form.Item
              name={["transactions", 0, "quantity"]}
              label="Количество элементов"
              rules={[{ required: true }]}
            >
              <Input
                type="number"
                step="1"
                placeholder="Введите количество элементов"
              />
            </Form.Item>

            {/* Framework Front - Select */}
            <Form.Item
              name={["transactions", 0, "frame_front_id"]}
              label="Каркас передний"
            >
              <SelectInfinitive
                placeholder="Выберите передний каркас"
                queryKey="framework_front"
                fetchUrl="/product/by/category?category_id=1"
                labelKey="name"
                valueKey="product_id"
                useValueAsLabel
              />
            </Form.Item>

            {/* Framework Back - Select */}
            <Form.Item
              name={["transactions", 0, "frame_back_id"]}
              label="Каркас задний"
            >
              <SelectInfinitive
                placeholder="Выберите задний каркас"
                queryKey="framework_back"
                fetchUrl="/product/by/category?category_id=2"
                labelKey="name"
                valueKey="product_id"
                useValueAsLabel
              />
            </Form.Item>

            {/* Threshold - Select */}
            <Form.Item name={["transactions", 0, "threshold"]} label="Порог">
              <Select
                placeholder="Выберите порог"
                options={[
                  { value: "yes", label: "Да" },
                  { value: "no", label: "Нет" },
                  { value: "custom", label: "Кастомный" },
                ]}
              />
            </Form.Item>

            {/* Opening Logic - Select */}
            <Form.Item
              name={["transactions", 0, "opening_direction"]}
              label="Логика открывания"
            >
              <Select
                placeholder="Выберите логику открывания"
                options={[
                  { value: "left", label: "Левое" },
                  { value: "right", label: "Правое" },
                  { value: "up", label: "Вверх" },
                  { value: "down", label: "Вниз" },
                ]}
              />
            </Form.Item>
          </div>
        </Collapse.Panel>
      </Collapse>

      <Divider />

      {/* ===== Другие параметры ===== */}
      <Collapse ghost>
        <Collapse.Panel key={"2"} header={"Другие параметры"}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherParamsEntries.map(([key, sampleValue]) => (
              <Form.Item
                key={key}
                name={["transactions", 0, key]}
                label={prettifyKey(key)}
              >
                {typeof sampleValue === "number" ? (
                  <Input type="number" />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>

      <Divider />
      <Divider />
    </div>
  );
};
