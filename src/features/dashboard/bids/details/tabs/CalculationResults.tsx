import type { FC } from "react";
import { ApplicationDetail } from "@/features/dashboard/bids/details";
import { useTranslation } from "react-i18next";
import { formatMoneyDecimal } from "@/shared/utils";
import { Card, Typography } from "antd";
import { TableWrapper } from "@/shared/ui/table/TableWrapper";

const { Title } = Typography;

interface Props {
  application: ApplicationDetail;
}

export const CalculationResults: FC<Props> = ({ application }) => {

  const { t } = useTranslation();

  // Helper function to calculate total forecast for a specific category
  const calculateTotalForecast = (transactions: any[], forecastKey: string) => {
    const total = transactions.reduce((sum, transaction) => {
      return sum + (transaction[forecastKey] || 0);
    }, 0);
    return (total * 100) / 100;
  };

  // Main Products Table
  const mainProductsColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "product",
      key: "name",
      render: (product: any) => product?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "volume_product",
      key: "volume",
      width: 100,
      render: (volume: number) => volume?.toFixed(2) || "0.00",
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "product",
      key: "unit_price",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_product || 0, 2);
      },
    },
  ];

  // Sheathing Table
  const sheathingColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "sheathing",
      key: "name",
      render: (sheathing: any) => sheathing?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "volume_sheathing",
      key: "volume",
      width: 100,
      render: (volume: number) => volume?.toFixed(2) || "0.00",
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "sheathing",
      key: "unit_price",
      width: 150,
      render: (sheathing: any) =>
        formatMoneyDecimal(sheathing?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_sheathing || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Trim Table
  const trimColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "trim",
      key: "name",
      render: (trim: any) => trim?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "trim_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "volume_trim",
      key: "volume",
      width: 100,
      render: (volume: number) => volume?.toFixed(2) || "0.00",
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "trim",
      key: "unit_price",
      width: 150,
      render: (trim: any) => formatMoneyDecimal(trim?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_trim || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Filler Table
  const fillerColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "filler",
      key: "name",
      render: (filler: any) => filler?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "filler_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "volume_filler",
      key: "volume",
      width: 100,
      render: (volume: number) => volume?.toFixed(2) || "0.00",
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "filler",
      key: "unit_price",
      width: 150,
      render: (filler: any) => formatMoneyDecimal(filler?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_filler || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Door Lock Table
  const doorLockColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "door_lock",
      key: "name",
      render: (doorLock: any) => doorLock?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "door_lock_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "door_lock",
      key: "unit_price",
      width: 150,
      render: (doorLock: any) =>
        formatMoneyDecimal(doorLock?.price_uzs || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_door_lock || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Canopy Table
  const canopyColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "canopy",
      key: "name",
      render: (canopy: any) => canopy?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "canopy_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "canopy",
      key: "unit_price",
      width: 150,
      render: (canopy: any) => formatMoneyDecimal(canopy?.price_uzs || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_canopy || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Glass Table
  const glassColumns = [
    {
      title: "№",
      dataIndex: "application_transaction_id",
      key: "id",
      width: 60,
    },
    {
      title: t("common.labels.name"),
      dataIndex: "glass",
      key: "name",
      render: (glass: any) => glass?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "glass_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "glass",
      key: "unit_price",
      width: 150,
      render: (glass: any) => formatMoneyDecimal(glass?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast_glass || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  // Services Table
  const servicesColumns = [
    {
      title: "№",
      dataIndex: "application_service_id",
      key: "id",
      width: 60,
    },
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
      render: (service: any) => formatMoneyDecimal(service?.price_uzs || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
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
      render: (baseboard: any) => baseboard?.name || "",
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
      render: (baseboard: any) =>
        formatMoneyDecimal(baseboard?.price_usd || 0, 2),
    },
    {
      title: t("common.labels.total_price"),
      key: "total_price",
      width: 150,
      render: (_: any, record: any) => {
        return formatMoneyDecimal(record.forecast || 0, 2);
      },
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "forecast_product",
      key: "forecast_product",
      width: 150,
      render: (product: any) => formatMoneyDecimal(product?.price_usd || 0, 2),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Products */}
      <Card>
        <Title level={4}>{t("common.labels.main_products")}</Title>
        <TableWrapper
          columns={mainProductsColumns}
          data={application.application_transactions?.filter((t) => t.door_product) || []}
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
                {formatMoneyDecimal(
                  calculateTotalForecast(
                    application.application_transactions || [],
                    "forecast_product",
                  ),
                  2,
                )}
              </span>
            </div>
          )}
        />
      </Card>

      {/* Sheathing */}
      {application.application_transactions?.some((t) => t.sheathing_product) && (
        <Card>
          <Title level={4}>{t("common.labels.sheathing")}</Title>
          <TableWrapper
            columns={sheathingColumns}
            data={application.application_transactions?.filter((t) => t.sheathing_product) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application.application_transactions || [],
                      "forecast_sheathing",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Trims */}
      {application?.application_transactions?.some((t) => t.trim_product) && (
        <Card>
          <Title level={4}>{t("common.labels.trims")}</Title>
          <TableWrapper
            columns={trimColumns}
            data={application?.application_transactions?.filter((t) => t.trim_product) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application?.application_transactions || [],
                      "forecast_trim",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Fillers */}
      {application?.application_transactions?.some((t) => t.filler_product) && (
        <Card>
          <Title level={4}>{t("common.labels.fillers")}</Title>
          <TableWrapper
            columns={fillerColumns}
            data={application?.application_transactions?.filter((t) => t.filler_product) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application?.application_transactions || [],
                      "forecast_filler",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Door Locks */}
      {application?.application_transactions?.some((t) => t.door_lock_product) && (
        <Card>
          <Title level={4}>{t("common.labels.door_locks")}</Title>
          <TableWrapper
            columns={doorLockColumns}
            data={application?.application_transactions?.filter((t) => t.door_lock_product) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application?.application_transactions || [],
                      "forecast_door_lock",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Canopies */}
      {application?.application_transactions?.some((t) => t.canopy) && (
        <Card>
          <Title level={4}>{t("common.labels.canopies")}</Title>
          <TableWrapper
            columns={canopyColumns}
            data={application?.application_transactions?.filter((t) => t.canopy) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application?.application_transactions || [],
                      "forecast_canopy",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Glass */}
      {application?.application_transactions?.some((t) => t.glass_product) && (
        <Card>
          <Title level={4}>{t("common.labels.glass")}</Title>
          <TableWrapper
            columns={glassColumns}
            data={application?.application_transactions?.filter((t) => t.glass_product) || []}
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
                  {formatMoneyDecimal(
                    calculateTotalForecast(
                      application?.application_transactions || [],
                      "forecast_glass",
                    ),
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Services */}
      {application.application_services && application.application_services.length > 0 && (
        <Card>
          <Title level={4}>{t("common.labels.services")}</Title>
          <TableWrapper
            columns={servicesColumns}
            data={application.application_services || []}
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
                  {formatMoneyDecimal(
                    Math.round(
                      (application.application_services || []).reduce(
                        (sum, item) => sum + (item.forecast || 0),
                        0,
                      ) * 100,
                    ) / 100,
                    2,
                  )}
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
                  {formatMoneyDecimal(
                    Math.round(
                      (application.baseboards || []).reduce((sum, item) => {
                        const unitPrice = item.baseboard?.price_usd || 0;
                        const quantity = item.quantity || 0;
                        const length = item.length || 0;
                        return (
                          sum +
                          unitPrice *
                          quantity *
                          length *
                          (application.forecast_rate || 1)
                        );
                      }, 0) * 100,
                    ) / 100,
                    2,
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}
    </div>
  );
};
