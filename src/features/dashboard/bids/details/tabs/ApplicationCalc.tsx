import type { FC } from "react";
import { useState, useEffect } from "react";
import { ContentInner, Input, NumberInput, Button, Select } from "@/shared/ui";
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
  forecaster?: string;
  forecast_rate: number;
  forecast_discount?: number;
  forecast_discount_percent?: number;
  forecast_prepayment: number;
  status: number;
  discount_type?: number;
  forecast_active_currency?: number;
  forecast_discount_type?: number;
  forecast_discount_amount?: number;
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
      onError: (error) => {
        message.error(t("common.messages.calculation_error"));
      },
    });

  // Pre-populate form with existing forecast data from API response
  useEffect(() => {
    if (application) {
      form.setFieldsValue({
        forecaster: application.forecaster || "",
        forecast_rate: application.forecast_rate || 0,
        forecast_discount: application.forecast_discount || 0,
        forecast_discount_percent: application.forecast_discount_percent || 0,
        forecast_prepayment: application.forecast_prepayment || 0,
        discount_type: 1, // Default to "Точная сумма" (Exact amount)
      });

      // Automatically send calculation request if we have existing forecast data
      if (application.forecast_rate && application.forecast_rate > 0) {
        const requestBody: ForecastRequest = {
          forecaster: application.forecaster || "",
          forecast_rate: application.forecast_rate,
          forecast_discount: application.forecast_discount || 0,
          forecast_discount_percent: application.forecast_discount_percent || 0,
          forecast_prepayment: application.forecast_prepayment || 0,
          status: 2,
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

      const requestBody: any = {
        forecaster: values.forecaster || "",
        forecast_rate: values.forecast_rate || 0,
        forecast_discount: values.forecast_discount || 0,
        forecast_discount_percent: values.forecast_discount_percent || 0,
        forecast_prepayment: values.forecast_prepayment || 0,
        status: 2,
        // Include transactions if they exist in the application
        ...(application.application_transactions && {
          application_transactions: application.application_transactions,
        }),
      };

      forecastApplication({ id: id.toString(), formData: requestBody });
    } catch (error) {
      message.error(t("common.messages.calculation_error"));
    }
  };

  return (
    <Form form={form} layout="vertical">
      <ContentInner className={"flex flex-col gap-4 sm:grid lg:grid-cols-3"}>
        <div
          className={"flex flex-row gap-4 sm:grid lg:col-span-2 lg:grid-cols-2"}
        >
          <div
            className={
              "flex h-full w-full flex-col gap-2 rounded-lg border border-gray-500/30 bg-primary/10 p-4"
            }
          >
            <h2 className="text-sm">{t("production_amount")}</h2>
            <span className="text-3xl font-bold">
              {formatMoneyDecimal(displayData?.forecast_production)} USD
            </span>
            <Form.Item name={"forecast_production"}>
              <Input hidden />
            </Form.Item>
          </div>
          <div
            className={
              "flex h-full w-full flex-col gap-2 rounded-lg border border-gray-500/30 bg-primary/10 p-4"
            }
          >
            <h2 className="text-sm">{t("total_to_pay")}</h2>
            <span className="text-3xl font-bold">
              {formatMoneyDecimal(displayData?.forecast_sum)} USD
            </span>
          </div>
          <div
            className={
              "flex h-full w-full flex-col gap-2 rounded-lg border border-gray-500/30 bg-primary/10 p-4"
            }
          >
            <h2 className="text-sm">{t("remaining_to_pay")}</h2>
            <span className="text-3xl font-bold">
              {formatMoneyDecimal(displayData?.forecast_final)} USD
            </span>
          </div>

          <div
            className={
              "flex h-full w-full flex-col gap-2 rounded-lg border border-gray-500/30 bg-gray-500/10 p-4"
            }
          >
            <h2 className="text-sm">{t("currency_rate")}</h2>

            <Form.Item name="forecast_rate" noStyle>
              <NumberInput
                prefix={"$"}
                inputClassName="!text-3xl !pl-2 font-bold"
                placeholder={t("percentage")}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-500/30 p-4 sm:grid lg:col-span-1 lg:grid-cols-1">
          <Form.Item name={["forecaster", "company", "display_name"]} label={t("calculated_by")}>
            <Input placeholder={t("common.placeholder.address")} />
          </Form.Item>

          <Form.Item
            name="discount_type"
            label={t("discount_type")}
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
                      onChange={handleDiscountPercentChange}
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item name="forecast_prepayment" label={`${t("prepayment")}`}>
            <NumberInput placeholder={t("percentage")} />
          </Form.Item>

          <Button
            type="primary"
            loading={loading}
            onClick={handleCalculate}
            className="mt-4"
          >
            {t("common.button.calculate")}
          </Button>
        </div>
      </ContentInner>
    </Form>
  );
};
