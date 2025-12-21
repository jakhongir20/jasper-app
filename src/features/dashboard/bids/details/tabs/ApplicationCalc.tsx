import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, ContentInner, NumberInput, Select } from "@/shared/ui";
import { ApplicationDetail } from "@/features/dashboard/bids/details";
import { Form, message } from "antd";
import { useTranslation } from "react-i18next";
import { formatMoneyDecimal } from "@/shared/utils";
import { useForecastApplication } from "@/features/dashboard/bids/model/bids.mutations";

interface Props {
  id: number;
  application: ApplicationDetail;
  onForecastDataUpdate?: (data: ApplicationDetail) => void;
}

interface ForecastRequest {
  status?: number;
  forecast_rate?: number;
  forecast_active_currency?: number;
  forecast_discount_type?: number;
  forecast_discount_amount?: number;
  forecast_prepayment?: number;
}

export const ApplicationCalc: FC<Props> = ({
  application,
  id,
  onForecastDataUpdate,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [forecastData, setForecastData] = useState<ApplicationDetail | null>(
    null,
  );

  const { mutate: forecastApplication, isPending: loading } =
    useForecastApplication({
      onSuccess: (response) => {
        setForecastData(response);
        onForecastDataUpdate?.(response);
      },
      onError: () => {
        message.error(t("common.messages.calculation_error"));
      },
    });

  // Pre-populate form with existing forecast data from API response
  useEffect(() => {
    if (application) {
      const discountType = application.forecast_discount_type || 1;
      const discountAmount = application.forecast_discount_amount || 0;

      form.setFieldsValue({
        forecast_rate: application.forecast_rate || 0,
        forecast_prepayment: application.forecast_prepayment || 0,
        discount_type: discountType,
        // Populate the correct field based on discount type
        forecast_discount: discountType === 1 ? discountAmount : 0,
        forecast_discount_percent: discountType === 2 ? discountAmount : 0,
      });

      // Automatically send calculation request if we have existing forecast data
      if (application.forecast_rate && application.forecast_rate > 0) {
        const requestBody: ForecastRequest = {
          status: 2,
          forecast_rate: application.forecast_rate,
          forecast_discount_type: application.forecast_discount_type || 1,
          forecast_discount_amount: application.forecast_discount_amount || 0,
          forecast_prepayment: application.forecast_prepayment || 0,
        };

        forecastApplication({ id: id.toString(), formData: requestBody });
      }
    }
  }, [application, form, id, forecastApplication]);

  // Use forecast data if available, otherwise use original application data
  const displayData = forecastData || application;

  // Auto-calculate discount amount when discount percentage changes
  const handleDiscountPercentChange = (value: number | undefined) => {
    if (value && value > 0 && displayData?.forecast_sum) {
      const discountAmount = Math.round(
        (displayData.forecast_sum * value) / 100,
      );
      form.setFieldValue("forecast_discount", discountAmount);
    } else {
      form.setFieldValue("forecast_discount", 0);
    }
  };

  // Auto-calculate discount percentage when discount amount changes
  const handleDiscountAmountChange = (value: number | undefined) => {
    if (value && value > 0 && displayData?.forecast_sum) {
      const discountPercent =
        Math.round((value / displayData.forecast_sum) * 100 * 100) / 100;
      form.setFieldValue("forecast_discount_percent", discountPercent);
    } else {
      form.setFieldValue("forecast_discount_percent", 0);
    }
  };

  // Recalculate discount amount when forecast_sum changes
  useEffect(() => {
    const discountPercent = form.getFieldValue("forecast_discount_percent");
    if (discountPercent && discountPercent > 0 && displayData?.forecast_sum) {
      const discountAmount = Math.round(
        (displayData.forecast_sum * discountPercent) / 100,
      );
      form.setFieldValue("forecast_discount", discountAmount);
    }
  }, [displayData?.forecast_sum, form]);

  const handleCalculate = async () => {
    try {
      const values = await form.validateFields();

      // Determine the discount amount based on discount type
      const discountAmount =
        values.discount_type === 1
          ? values.forecast_discount || 0
          : values.forecast_discount_percent || 0;

      const requestBody: ForecastRequest = {
        status: 2,
        forecast_rate: values.forecast_rate || 0,
        forecast_discount_type: values.discount_type,
        forecast_discount_amount: discountAmount,
        forecast_prepayment: values.forecast_prepayment || 0,
      };

      forecastApplication({ id: id.toString(), formData: requestBody });
    } catch {
      message.error(t("common.messages.calculation_error"));
    }
  };

  return (
    <Form form={form} layout="vertical">
      <ContentInner className="flex flex-col gap-4 sm:grid lg:grid-cols-3">
        {/* Левая часть - блоки с суммами */}
        <div className="flex flex-col gap-4 sm:grid lg:col-span-2 lg:grid-cols-2">
          {/* Сумма производства */}
          <div className="flex h-full w-full flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h2 className="text-sm text-primary">Сумма производства</h2>
            <span className="text-2xl font-bold text-primary">
              {formatMoneyDecimal(displayData?.forecast_production)} USD
            </span>
          </div>

          {/* Сумма аксессуаров */}
          <div className="flex h-full w-full flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h2 className="text-sm text-primary">Сумма аксессуаров</h2>
            <span className="text-2xl font-bold text-primary">
              {formatMoneyDecimal(displayData?.forecast_accessories)} USD
            </span>
          </div>

          {/* Сумма услуг */}
          <div className="flex h-full w-full flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h2 className="text-sm text-primary">Сумма услуг</h2>
            <span className="text-2xl font-bold text-primary">
              {formatMoneyDecimal(displayData?.forecast_services)} USD
            </span>
          </div>

          {/* Всего к оплате - выделенный */}
          <div className="flex h-full w-full flex-col gap-2 rounded-xl border-2 border-primary bg-primary/10 p-4">
            <h2 className="text-sm font-medium text-primary">Всего к оплате</h2>
            <span className="text-2xl font-bold text-primary">
              {formatMoneyDecimal(displayData?.forecast_initial)} USD
            </span>
          </div>

          {/* Остаток к оплате - крупный выделенный блок на всю ширину */}
          <div className="flex h-full w-full flex-col gap-2 rounded-xl border-2 border-primary bg-primary/10 p-5 lg:col-span-2">
            <h2 className="text-sm font-medium text-primary">
              Остаток к оплате
            </h2>
            <span className="text-3xl font-bold text-primary">
              {formatMoneyDecimal(displayData?.forecast_final)} USD
            </span>
          </div>
        </div>

        {/* Правая часть - форма расчёта */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-500/30 p-4 lg:col-span-1">
          {/* Курс валюты */}
          <Form.Item name="forecast_rate" label="Курс валюты">
            <NumberInput prefix="$" placeholder="0" />
          </Form.Item>

          {/* Тип скидки */}
          <Form.Item
            name="discount_type"
            label={t("common.labels.discount_type")}
            rules={[{ required: true, message: "Выберите тип скидки" }]}
          >
            <Select
              placeholder="Выберите тип скидки"
              options={[
                { value: 1, label: "Точная сумма" },
                { value: 2, label: "В процентах" },
              ]}
              onChange={(value) => {
                // Reset discount values when type changes
                if (value === 1) {
                  form.setFieldValue("forecast_discount_percent", 0);
                } else {
                  form.setFieldValue("forecast_discount", 0);
                }
              }}
            />
          </Form.Item>

          {/* Скидка - динамическое поле в зависимости от типа */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.discount_type !== currentValues.discount_type
            }
          >
            {({ getFieldValue }) => {
              const discountType = getFieldValue("discount_type");

              if (discountType === 1) {
                return (
                  <Form.Item
                    name="forecast_discount"
                    label={`${t("discount")} (${t("common.labels.amount")})`}
                    rules={[{ type: "number", min: 0, message: "" }]}
                  >
                    <NumberInput
                      placeholder={t("common.labels.amount")}
                      onChange={handleDiscountAmountChange}
                    />
                  </Form.Item>
                );
              } else if (discountType === 2) {
                return (
                  <Form.Item
                    name="forecast_discount_percent"
                    label={`${t("discount")} (%)`}
                  >
                    <NumberInput
                      placeholder={t("percentage")}
                      min={0}
                      max={100}
                      onChange={handleDiscountPercentChange}
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          {/* Предоплата */}
          <Form.Item name="forecast_prepayment" label={t("prepayment")}>
            <NumberInput placeholder={t("percentage")} />
          </Form.Item>

          {/* Кнопка расчёта */}
          <Button
            type="primary"
            loading={loading}
            onClick={handleCalculate}
            className="mt-auto w-full"
          >
            {t("common.button.calculate")}
          </Button>
        </div>
      </ContentInner>
    </Form>
  );
};
