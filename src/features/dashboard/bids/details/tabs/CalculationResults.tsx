import type { FC } from "react";
import { ApplicationDetail } from "@/features/dashboard/bids/details";
import { useTranslation } from "react-i18next";
import { Card, Typography } from "antd";
import { TableWrapper } from "@/shared/ui/table/TableWrapper";

const { Title } = Typography;

interface Props {
  application: ApplicationDetail;
}

export const CalculationResults: FC<Props> = ({ application }) => {
  const { t } = useTranslation();

  type TxProduct = { name?: string; price_usd?: number } | null | undefined;
  type TransactionRow = Record<string, unknown>;

  const txs: TransactionRow[] =
    (
      application as unknown as {
        application_transactions?: TransactionRow[];
      }
    ).application_transactions || [];
  const appServices: Record<string, unknown>[] =
    (
      application as unknown as {
        application_services?: Record<string, unknown>[];
      }
    ).application_services || [];

  // Helper function to calculate total forecast for a specific category
  const calculateTotalForecast = (
    transactions: TransactionRow[],
    forecastKey: string,
  ) => {
    const total = transactions.reduce(
      (sum: number, transaction: TransactionRow) => {
        const value =
          Number(
            (transaction as Record<string, unknown>)[forecastKey] as
              | number
              | string
              | undefined,
          ) || 0;
        return sum + value;
      },
      0,
    );
    return Math.round(total * 100) / 100;
  };

  // Fields that should display "Quantity" instead of "Volume"
  const quantityFields = [
    "under_frame",
    "up_frame",
    "door_stopper",
    "anti_threshold",
  ];

  // Product configuration for dynamic table generation
  type ProductConfig = {
    key: string;
    titleKey: string;
    productField: string;
    quantityField?: string;
    volumeField?: string;
    forecastField: string;
    useQuantity: boolean; // true = show Quantity column, false = show Volume column
  };

  const productConfigs: ProductConfig[] = [
    {
      key: "door",
      titleKey: "main_products",
      productField: "door_product",
      quantityField: "entity_quantity",
      volumeField: "volume_door",
      forecastField: "forecast_door_product",
      useQuantity: false,
    },
    {
      key: "transom",
      titleKey: "transoms",
      productField: "transom_product",
      quantityField: "entity_quantity",
      volumeField: "volume_transom",
      forecastField: "forecast_transom_product",
      useQuantity: false,
    },
    {
      key: "sheathing",
      titleKey: "sheathing",
      productField: "sheathing_product",
      quantityField: "entity_quantity",
      volumeField: "volume_sheathing",
      forecastField: "forecast_sheathing_product",
      useQuantity: false,
    },
    {
      key: "frame",
      titleKey: "frames",
      productField: "frame_product",
      quantityField: "entity_quantity",
      volumeField: "volume_frame",
      forecastField: "forecast_frame_product",
      useQuantity: false,
    },
    {
      key: "filler",
      titleKey: "fillers",
      productField: "filler_product",
      quantityField: "entity_quantity",
      volumeField: "volume_filler",
      forecastField: "forecast_filler_product",
      useQuantity: false,
    },
    {
      key: "crown",
      titleKey: "crowns",
      productField: "crown_product",
      quantityField: "entity_quantity",
      volumeField: "volume_crown",
      forecastField: "forecast_crown_product",
      useQuantity: false,
    },
    {
      key: "up_frame",
      titleKey: "up_frames",
      productField: "up_frame_product",
      quantityField: "up_frame_quantity",
      forecastField: "forecast_up_frame_product",
      useQuantity: true,
    },
    {
      key: "under_frame",
      titleKey: "under_frames",
      productField: "under_frame_product",
      quantityField: "under_frame_quantity",
      volumeField: "under_frame_height",
      forecastField: "forecast_under_frame_product",
      useQuantity: true,
    },
    {
      key: "trim",
      titleKey: "trims",
      productField: "trim_product",
      quantityField: "entity_quantity",
      volumeField: "percent_trim",
      forecastField: "forecast_trim_product",
      useQuantity: false,
    },
    {
      key: "molding",
      titleKey: "moldings",
      productField: "molding_product",
      quantityField: "entity_quantity",
      volumeField: "percent_molding",
      forecastField: "forecast_molding_product",
      useQuantity: false,
    },
    {
      key: "covering_primary",
      titleKey: "covering_primary",
      productField: "covering_primary_product",
      quantityField: "entity_quantity",
      volumeField: "percent_covering_primary",
      forecastField: "forecast_covering_primary_product",
      useQuantity: false,
    },
    {
      key: "covering_secondary",
      titleKey: "covering_secondary",
      productField: "covering_secondary_product",
      quantityField: "entity_quantity",
      volumeField: "percent_covering_secondary",
      forecastField: "forecast_covering_secondary_product",
      useQuantity: false,
    },
    {
      key: "color",
      titleKey: "colors",
      productField: "color_product",
      quantityField: "entity_quantity",
      volumeField: "percent_color",
      forecastField: "forecast_color_product",
      useQuantity: false,
    },
    {
      key: "floor_skirting",
      titleKey: "floor_skirtings",
      productField: "floor_skirting_product",
      quantityField: "entity_quantity",
      volumeField: "floor_skirting_length",
      forecastField: "forecast_floor_skirting_product",
      useQuantity: false,
    },
    {
      key: "heated_floor",
      titleKey: "heated_floors",
      productField: "heated_floor_product",
      quantityField: "entity_quantity",
      volumeField: "volume_heated_floor",
      forecastField: "forecast_heated_floor_product",
      useQuantity: false,
    },
    {
      key: "latting",
      titleKey: "lattings",
      productField: "latting_product",
      quantityField: "entity_quantity",
      volumeField: "volume_latting",
      forecastField: "forecast_latting_product",
      useQuantity: false,
    },
    {
      key: "window",
      titleKey: "windows",
      productField: "window_product",
      quantityField: "entity_quantity",
      volumeField: "volume_window",
      forecastField: "forecast_window_product",
      useQuantity: false,
    },
    {
      key: "windowsill",
      titleKey: "windowsills",
      productField: "windowsill_product",
      quantityField: "entity_quantity",
      volumeField: "volume_windowsill",
      forecastField: "forecast_windowsill_product",
      useQuantity: false,
    },
    {
      key: "glass",
      titleKey: "glass",
      productField: "glass_product",
      quantityField: "entity_quantity",
      volumeField: "volume_glass",
      forecastField: "forecast_glass_product",
      useQuantity: false,
    },
    {
      key: "door_lock",
      titleKey: "door_locks",
      productField: "door_lock_product",
      quantityField: "entity_quantity",
      volumeField: "volume_door_lock",
      forecastField: "forecast_door_lock_product",
      useQuantity: false,
    },
    {
      key: "hinge",
      titleKey: "hinges",
      productField: "hinge_product",
      quantityField: "entity_quantity",
      volumeField: "volume_hinge",
      forecastField: "forecast_hinge_product",
      useQuantity: false,
    },
    {
      key: "door_bolt",
      titleKey: "door_bolts",
      productField: "door_bolt_product",
      quantityField: "entity_quantity",
      volumeField: "volume_door_bolt",
      forecastField: "forecast_door_bolt_product",
      useQuantity: false,
    },
    {
      key: "door_stopper",
      titleKey: "door_stoppers",
      productField: "door_stopper_product",
      quantityField: "door_stopper_quantity",
      forecastField: "forecast_door_stopper_product",
      useQuantity: true,
    },
    {
      key: "anti_threshold",
      titleKey: "anti_thresholds",
      productField: "anti_threshold_product",
      quantityField: "anti_threshold_quantity",
      forecastField: "forecast_anti_threshold_product",
      useQuantity: true,
    },
    {
      key: "extra_option",
      titleKey: "extra_options",
      productField: "extra_option_product",
      quantityField: "entity_quantity",
      volumeField: "percent_extra_option",
      forecastField: "forecast_extra_option_product",
      useQuantity: false,
    },
  ];

  // Generate columns dynamically based on configuration
  const generateColumns = (config: ProductConfig) => {
    const columns: any[] = [
      {
        title: t("common.labels.name"),
        dataIndex: config.productField,
        key: "name",
        render: (product: any) => product?.name || "",
      },
      {
        title: t("common.labels.quantity"),
        dataIndex: config.quantityField,
        key: "quantity",
        width: 100,
      },
    ];

    // Add Volume column only if useQuantity is false
    if (!config.useQuantity && config.volumeField) {
      columns.push({
        title: t("common.labels.volume"),
        dataIndex: config.volumeField,
        key: "volume",
        width: 100,
        render: (value: number) => value ?? "0.00",
      });
    }

    columns.push(
      {
        title: t("common.labels.unit_price"),
        dataIndex: config.productField,
        key: "unit_price",
        width: 150,
        render: (product: any) => product?.price_usd ?? 0,
      },
      {
        title: "Итого",
        dataIndex: config.forecastField,
        key: config.forecastField,
        width: 150,
        render: (value: number) => value ?? 0,
      },
    );

    return columns;
  };

  // Render product table card
  const renderProductCard = (config: ProductConfig) => {
    const hasData = txs.some((t: TransactionRow) =>
      Boolean((t as any)[config.productField]),
    );

    if (!hasData) return null;

    return (
      <Card key={config.key}>
        <Title level={4}>{t(`common.labels.${config.titleKey}`)}</Title>
        <TableWrapper
          columns={generateColumns(config)}
          data={txs.filter((t: TransactionRow) =>
            Boolean((t as any)[config.productField]),
          )}
          loading={false}
          showSearch={false}
          showAddButton={false}
          showFilter={false}
          pagination={false}
          emptyTableClassName="min-h-0"
          title={() => (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                {t("common.labels.total")}:{" "}
                {calculateTotalForecast(txs, config.forecastField)}
              </span>
            </div>
          )}
        />
      </Card>
    );
  };

  // Services Table
  const servicesColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "service",
      key: "name",
      render: (service: any) => service?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "service",
      key: "unit_price",
      width: 150,
      render: (service: any) => service?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast",
      key: "forecast",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Baseboards Table
  const baseboardsColumns = [
    {
      title: "№",
      dataIndex: "application_baseboard_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "baseboard",
      key: "name",
      render: (baseboard: TxProduct) => baseboard?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.length"),
      dataIndex: "length",
      key: "length",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "baseboard",
      key: "unit_price",
      width: 150,
      render: (baseboard: TxProduct) => baseboard?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast",
      key: "forecast",
      width: 150,
      render: (_: any, record: TransactionRow) => {
        return record.forecast ?? 0;
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: TxProduct) => product?.price_usd ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Render all product cards */}
      {productConfigs.map((config) => renderProductCard(config))}

      {/* Services */}
      {appServices && appServices.length > 0 && (
        <Card>
          <Title level={4}>{t("common.labels.services")}</Title>
          <TableWrapper
            columns={servicesColumns}
            data={appServices}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}:{" "}
                  {Math.round(
                    (appServices || []).reduce(
                      (sum: number, item: Record<string, unknown>) =>
                        sum + (Number((item as any).forecast) || 0),
                      0,
                    ) * 100,
                  ) / 100}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Baseboards */}
      {application.baseboards && application.baseboards.length > 0 && (
        <Card>
          <Title level={4}>{t("common.labels.baseboards")}</Title>
          <TableWrapper
            columns={baseboardsColumns}
            data={application.baseboards || []}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            emptyTableClassName="min-h-0"
            pagination={false}
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}:{" "}
                  {Math.round(
                    (application.baseboards || []).reduce((sum, item) => {
                      const unitPrice = Number(item.baseboard?.price_usd) || 0;
                      const quantity = Number(item.quantity) || 0;
                      const length = Number(item.length) || 0;
                      return (
                        sum +
                        unitPrice *
                          quantity *
                          length *
                          (application.forecast_rate || 1)
                      );
                    }, 0) * 100,
                  ) / 100}
                </span>
              </div>
            )}
          />
        </Card>
      )}
    </div>
  );
};
