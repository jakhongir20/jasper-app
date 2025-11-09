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

export const TransactionForm: FC<Props> = ({ className, mode }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ApplicationLocalForm>();

  return (
    <div className={cn(className)}>
      {/* Тип продукта над формой */}
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

      {/* ====================== Замерка ====================== */}
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

      {/* =================== Другие параметры =================== */}
      <Collapse ghost>
        <Collapse.Panel key={"2"} header={"Другие параметры"}>
          <div className="space-y-10">
            {/* ---------- Фрамуга ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Фрамуга
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Form.Item
                  name={["transactions", 0, "transom_type"]}
                  label="Тип фрамуги"
                >
                  <Select
                    placeholder="Выберите тип фрамуги"
                    options={[
                      { value: "none", label: "Нет" },
                      { value: "front", label: "Лицо" },
                      { value: "back", label: "Зад" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "transom_height_front"]}
                  label="Высота фрамуги (лицо)"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "transom_height_back"]}
                  label="Высота фрамуги (зад)"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "transom_product_id"]}
                  label="Модель фрамуги"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель фрамуги"
                    queryKey="transom"
                    fetchUrl="/product/by/category?category_id=10"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Полотно (Дверь) ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Полотно (Дверь)
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Form.Item
                  name={["transactions", 0, "door_product_id"]}
                  label="Модель двери"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель двери"
                    queryKey="door"
                    fetchUrl="/product/by/category?category_id=11"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Обшивка ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Обшивка
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Form.Item
                  name={["transactions", 0, "sheathing_product_id"]}
                  label="Модель обшивки"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель обшивки"
                    queryKey="sheathing"
                    fetchUrl="/product/by/category?category_id=12"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Наличник / Нашельник / Корона ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Наличник и элементы
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Наличник */}
                <Form.Item
                  name={["transactions", 0, "frame_product_id"]}
                  label="Модель наличника"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель наличника"
                    queryKey="frame"
                    fetchUrl="/product/by/category?category_id=13"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Нашельник */}
                <Form.Item
                  name={["transactions", 0, "filler_product_id"]}
                  label="Модель нашельника"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель нашельника"
                    queryKey="filler"
                    fetchUrl="/product/by/category?category_id=14"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Корона */}
                <Form.Item
                  name={["transactions", 0, "crown_product_id"]}
                  label="Модель короны"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель короны"
                    queryKey="crown"
                    fetchUrl="/product/by/category?category_id=15"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Кубик (надналичник) */}
                <Form.Item
                  name={["transactions", 0, "up_frame_quantity"]}
                  label="Кол-во надналичников"
                >
                  <Input type="number" step="1" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "up_frame_product_id"]}
                  label="Модель надналичника"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель надналичника"
                    queryKey="up_frame"
                    fetchUrl="/product/by/category?category_id=16"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Сапожок (подналичник) */}
                <Form.Item
                  name={["transactions", 0, "under_frame_quantity"]}
                  label="Кол-во подналичников"
                >
                  <Input type="number" step="1" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "under_frame_height"]}
                  label="Высота подналичника"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "under_frame_product_id"]}
                  label="Модель подналичника"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель подналичника"
                    queryKey="under_frame"
                    fetchUrl="/product/by/category?category_id=17"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Обклад / Молдинг / Покрытие / Цвет ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Отделка
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Обклад */}
                <Form.Item
                  name={["transactions", 0, "percent_trim"]}
                  label="Процент обклада"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "trim_product_id"]}
                  label="Модель обклада"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель обклада"
                    queryKey="trim"
                    fetchUrl="/product/by/category?category_id=18"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Молдинг */}
                <Form.Item
                  name={["transactions", 0, "percent_molding"]}
                  label="Процент молдинга"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "molding_product_id"]}
                  label="Модель молдинга"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель молдинга"
                    queryKey="molding"
                    fetchUrl="/product/by/category?category_id=19"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Покрытие I */}
                <Form.Item
                  name={["transactions", 0, "percent_covering_primary"]}
                  label="Покрытие I, %"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "covering_primary_product_id"]}
                  label="Модель покрытия I"
                >
                  <SelectInfinitive
                    placeholder="Выберите покрытие I"
                    queryKey="covering_primary"
                    fetchUrl="/product/by/category?category_id=20"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Покрытие II */}
                <Form.Item
                  name={["transactions", 0, "percent_covering_secondary"]}
                  label="Покрытие II, %"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "covering_secondary_product_id"]}
                  label="Модель покрытия II"
                >
                  <SelectInfinitive
                    placeholder="Выберите покрытие II"
                    queryKey="covering_secondary"
                    fetchUrl="/product/by/category?category_id=21"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Цвет */}
                <Form.Item
                  name={["transactions", 0, "percent_color"]}
                  label="Цвет, %"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "color_custom_name"]}
                  label="Название цвета"
                >
                  <Input placeholder="Например, RAL 9003" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "color_product_id"]}
                  label="Модель цвета"
                >
                  <SelectInfinitive
                    placeholder="Выберите цвет"
                    queryKey="color"
                    fetchUrl="/product/by/category?category_id=22"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Плинтус / Теплый пол / Обрешетка / Окно / Подоконник ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Плинтус, теплый пол, обрешетка, окно, подоконник
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Плинтус */}
                <Form.Item
                  name={["transactions", 0, "floor_skirting_length"]}
                  label="Длина плинтуса"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "floor_skirting_product_id"]}
                  label="Модель плинтуса"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель плинтуса"
                    queryKey="floor_skirting"
                    fetchUrl="/product/by/category?category_id=23"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Теплый пол */}
                <Form.Item
                  name={["transactions", 0, "heated_floor_product_id"]}
                  label="Модель теплого пола"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель теплого пола"
                    queryKey="heated_floor"
                    fetchUrl="/product/by/category?category_id=24"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Обрешетка */}
                <Form.Item
                  name={["transactions", 0, "latting_product_id"]}
                  label="Модель обрешетки"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель обрешетки"
                    queryKey="latting"
                    fetchUrl="/product/by/category?category_id=25"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Окно */}
                <Form.Item
                  name={["transactions", 0, "window_product_id"]}
                  label="Модель окна"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель окна"
                    queryKey="window"
                    fetchUrl="/product/by/category?category_id=26"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Подоконник */}
                <Form.Item
                  name={["transactions", 0, "windowsill_product_id"]}
                  label="Модель подоконника"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель подоконника"
                    queryKey="windowsill"
                    fetchUrl="/product/by/category?category_id=27"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Стекло ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Стекло
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Form.Item
                  name={["transactions", 0, "glass_quantity"]}
                  label="Количество стекол"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "glass_product_id"]}
                  label="Модель стекла"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель стекла"
                    queryKey="glass"
                    fetchUrl="/product/by/category?category_id=28"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "volume_glass"]}
                  label="Объем стекла"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Замок / Петля / Шпингалет / Стоппер / Анти-порог ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Фурнитура
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Замок двери */}
                <Form.Item
                  name={["transactions", 0, "door_lock_quantity"]}
                  label="Кол-во замков"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "door_lock_mechanism"]}
                  label="Механизм замка"
                >
                  <Select
                    placeholder="Выберите механизм замка"
                    options={[
                      { value: "mechanical", label: "Механический" },
                      { value: "magnetic", label: "Магнитный" },
                      { value: "other", label: "Другое" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "door_lock_product_id"]}
                  label="Модель замка"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель замка"
                    queryKey="door_lock"
                    fetchUrl="/product/by/category?category_id=29"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Петля */}
                <Form.Item
                  name={["transactions", 0, "hinge_quantity"]}
                  label="Кол-во петель"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "hinge_mechanism"]}
                  label="Механизм петли"
                >
                  <Select
                    placeholder="Выберите механизм петли"
                    options={[
                      { value: "standard", label: "Стандарт" },
                      { value: "hidden", label: "Скрытая" },
                      { value: "other", label: "Другое" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "hinge_product_id"]}
                  label="Модель петли"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель петли"
                    queryKey="hinge"
                    fetchUrl="/product/by/category?category_id=30"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Шпингалет */}
                <Form.Item
                  name={["transactions", 0, "door_bolt_quantity"]}
                  label="Кол-во шпингалетов"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "door_bolt_product_id"]}
                  label="Модель шпингалета"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель шпингалета"
                    queryKey="door_bolt"
                    fetchUrl="/product/by/category?category_id=31"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Стоппер */}
                <Form.Item
                  name={["transactions", 0, "door_stopper_quantity"]}
                  label="Кол-во стопера"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "door_stopper_product_id"]}
                  label="Модель стопера"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель стопера"
                    queryKey="door_stopper"
                    fetchUrl="/product/by/category?category_id=32"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>

                {/* Анти-порог */}
                <Form.Item
                  name={["transactions", 0, "anti_threshold_quantity"]}
                  label="Кол-во анти-порогов"
                >
                  <Input type="number" step="1" />
                </Form.Item>
                <Form.Item
                  name={["transactions", 0, "anti_threshold_product_id"]}
                  label="Модель анти-порога"
                >
                  <SelectInfinitive
                    placeholder="Выберите модель анти-порога"
                    queryKey="anti_threshold"
                    fetchUrl="/product/by/category?category_id=33"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>

            {/* ---------- Ширина коробки / Доп. опция ---------- */}
            <section>
              <h4 className="mb-3 text-sm font-medium text-[#1d7488]">
                Ширина коробки и доп. опции
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Form.Item
                  name={["transactions", 0, "box_width"]}
                  label="Ширина коробки"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "percent_extra_option"]}
                  label="Процент доп. опции"
                >
                  <Input type="number" step="0.01" />
                </Form.Item>

                <Form.Item
                  name={["transactions", 0, "extra_option_product_id"]}
                  label="Модель доп. опции"
                >
                  <SelectInfinitive
                    placeholder="Выберите доп. опцию"
                    queryKey="extra_option"
                    fetchUrl="/product/by/category?category_id=34"
                    labelKey="name"
                    valueKey="product_id"
                    useValueAsLabel
                  />
                </Form.Item>
              </div>
            </section>
          </div>
        </Collapse.Panel>
      </Collapse>

      <Divider />
    </div>
  );
};
