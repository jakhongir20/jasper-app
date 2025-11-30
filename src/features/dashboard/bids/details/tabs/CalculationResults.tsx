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

  type TxProduct = { name?: string; price_usd?: number; } | null | undefined;
  type TransactionRow = Record<string, unknown>;

  const txs: TransactionRow[] = (application as unknown as { application_transactions?: TransactionRow[]; })
    .application_transactions || [];
  const appServices: Record<string, unknown>[] = (application as unknown as { application_services?: Record<string, unknown>[]; })
    .application_services || [];

  // Helper function to calculate total forecast for a specific category
  const calculateTotalForecast = (transactions: TransactionRow[], forecastKey: string) => {
    const total = transactions.reduce((sum: number, transaction: TransactionRow) => {
      const value = Number((transaction as Record<string, unknown>)[forecastKey] as number | string | undefined) || 0;
      return sum + value;
    }, 0);
    return Math.round(total * 100) / 100;
  };

  // Main Products Table
  const mainProductsColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "door_product",
      key: "name",
      render: (product: any) => product?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "entity_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "door_product",
      key: "unit_price",
      width: 150,
      render: (product: any) => product?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_door_product",
      key: "forecast_door_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Trim Table
  const trimColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "trim_product",
      key: "name",
      render: (trim: any) => trim?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "entity_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "percent_trim",
      key: "volume",
      width: 100,
      render: (value: number) => (typeof value === "number" ? value.toFixed(2) : "0.00"),
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "trim_product",
      key: "unit_price",
      width: 150,
      render: (trim: any) => trim?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_trim_product",
      key: "forecast_trim_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Filler Table
  const fillerColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "filler_product",
      key: "name",
      render: (filler: any) => filler?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "entity_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.volume"),
      dataIndex: "volume_filler",
      key: "volume",
      width: 100,
      render: (volume: number) => (typeof volume === "number" ? volume.toFixed(2) : "0.00"),
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "filler_product",
      key: "unit_price",
      width: 150,
      render: (filler: any) => filler?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_filler_product",
      key: "forecast_filler_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Door Lock Table
  const doorLockColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "door_lock_product",
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
      dataIndex: "door_lock_product",
      key: "unit_price",
      width: 150,
      render: (doorLock: any) => doorLock?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_door_lock_product",
      key: "forecast_door_lock_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Hinge Table
  const hingeColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "hinge_product",
      key: "name",
      render: (hinge: any) => hinge?.name || "",
    },
    {
      title: t("common.labels.quantity"),
      dataIndex: "hinge_quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("common.labels.unit_price"),
      dataIndex: "hinge_product",
      key: "unit_price",
      width: 150,
      render: (hinge: any) => hinge?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_hinge_product",
      key: "forecast_hinge_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

  // Glass Table
  const glassColumns = [
    {
      title: t("common.labels.name"),
      dataIndex: "glass_product",
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
      dataIndex: "glass_product",
      key: "unit_price",
      width: 150,
      render: (glass: any) => glass?.price_usd ?? 0,
    },
    {
      title: "Итого",
      dataIndex: "forecast_glass_product",
      key: "forecast_glass_product",
      width: 150,
      render: (value: number) => value ?? 0,
    },
  ];

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
      render: (baseboard: TxProduct) =>
        baseboard?.price_usd ?? 0,
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
      {/* Main Products */}
      <Card>
        <Title level={4}>{t("common.labels.main_products")}</Title>
        <TableWrapper
          columns={mainProductsColumns}
          data={txs.filter((t: TransactionRow) => Boolean((t as any).door_product))}
          loading={false}
          showSearch={false}
          showAddButton={false}
          showFilter={false}
          pagination={false}
          emptyTableClassName="min-h-0"
          title={() => (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                {t("common.labels.total")}: {" "}
                {calculateTotalForecast(
                  txs,
                  "forecast_door_product",
                )}
              </span>
            </div>
          )}
        />
      </Card>

      {/* Trims */}
      {txs.some((t: TransactionRow) => Boolean((t as any).trim_product)) && (
        <Card>
          <Title level={4}>{t("common.labels.trims")}</Title>
          <TableWrapper
            columns={trimColumns}
            data={txs.filter((t: TransactionRow) => Boolean((t as any).trim_product))}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}: {" "}
                  {calculateTotalForecast(
                    txs,
                    "forecast_trim_product",
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Fillers */}
      {txs.some((t: TransactionRow) => Boolean((t as any).filler_product)) && (
        <Card>
          <Title level={4}>{t("common.labels.fillers")}</Title>
          <TableWrapper
            columns={fillerColumns}
            data={txs.filter((t: TransactionRow) => Boolean((t as any).filler_product))}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}: {" "}
                  {calculateTotalForecast(
                    txs,
                    "forecast_filler_product",
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Door Locks */}
      {txs.some((t: TransactionRow) => Boolean((t as any).door_lock_product)) && (
        <Card>
          <Title level={4}>{t("common.labels.door_locks")}</Title>
          <TableWrapper
            columns={doorLockColumns}
            data={txs.filter((t: TransactionRow) => Boolean((t as any).door_lock_product))}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}: {" "}
                  {calculateTotalForecast(
                    txs,
                    "forecast_door_lock_product",
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Hinges */}
      {txs.some((t: TransactionRow) => Boolean((t as any).hinge_product)) && (
        <Card>
          <Title level={4}>{t("common.labels.hinges")}</Title>
          <TableWrapper
            columns={hingeColumns}
            data={txs.filter((t: TransactionRow) => Boolean((t as any).hinge_product))}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}: {" "}
                  {calculateTotalForecast(
                    txs,
                    "forecast_hinge_product",
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

      {/* Glass */}
      {txs.some((t: TransactionRow) => Boolean((t as any).glass_product)) && (
        <Card>
          <Title level={4}>{t("common.labels.glass")}</Title>
          <TableWrapper
            columns={glassColumns}
            data={txs.filter((t: TransactionRow) => Boolean((t as any).glass_product))}
            loading={false}
            showSearch={false}
            showAddButton={false}
            showFilter={false}
            pagination={false}
            emptyTableClassName="min-h-0"
            title={() => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {t("common.labels.total")}: {" "}
                  {calculateTotalForecast(
                    txs,
                    "forecast_glass_product",
                  )}
                </span>
              </div>
            )}
          />
        </Card>
      )}

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
                  {t("common.labels.total")}: {" "}
                  {Math.round(
                    (appServices || []).reduce(
                      (sum: number, item: Record<string, unknown>) => sum + (Number((item as any).forecast) || 0),
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
