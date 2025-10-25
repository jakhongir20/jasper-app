import { FC } from "react";
import { cn } from "@/shared/helpers";
import { Collapse, Divider, Form } from "antd";
import { ApplicationLocalForm } from "@/features/dashboard/bids";
import { Select } from "@/shared/ui";

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

export const TransactionForm: FC<Props> = ({ className, mode }) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
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

  return (
    <div className={cn(className)}>
      <Select
        options={PRODUCT_TYPES}
        value={form.getFieldValue(["transactions", "product_type"])}
        className="mb-5"
        onChange={(value) =>
          form.setFieldValue(["transactions", "product_type"], value)
        }
        title="Тип продукта"
        placeholder="Выберите тип продукта"
      />
      <Collapse ghost defaultActiveKey={"1"}>
        <Collapse.Panel key={"1"} header={"Замерка"}>
          Lorem ipsum dolor.
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Collapse ghost>
        <Collapse.Panel key={"2"} header={"Другие параметры"}>
          Lorem ipsum dolor.
        </Collapse.Panel>
      </Collapse>
      <Divider />
      <Divider />
    </div>
  );
};
