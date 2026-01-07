import { type FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnType } from "antd/es/table";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { useStaticAssetsUrl } from "@/shared/hooks";
import { ActionModal, Icon, TableWrapper } from "@/shared/ui";
import { Form, message } from "antd";
import {
  ApplicationLocalForm,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids/model";
import { TransactionDrawer } from "@/features/dashboard/bids/crud/tabs/TransactionDrawer";

// Hidden Form.Item to subscribe to transactions field and trigger re-renders
const TransactionsWatcher: FC = () => {
  return (
    <Form.Item name="transactions" noStyle>
      <input type="hidden" />
    </Form.Item>
  );
};

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabTransactionsForm: FC<Props> = ({
  className,
  mode,
  isLoadingDetail = false,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
  const { t } = useTranslation();
  const { getAssetUrl } = useStaticAssetsUrl();
  const { isOpen: isAddProductModalOpen, toggle: toggleProductModal } =
    useToggle();
  const { isOpen: isDeleteConfirmOpen, toggle: toggleDeleteConfirm } =
    useToggle();

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const onOpenDelete = (record: Transaction) => {
    setTransactionToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      const updatedTransactions = form
        .getFieldValue("transactions")
        ?.filter((item: Transaction) => item._uid !== transactionToDelete._uid);

      form.setFieldsValue({ transactions: updatedTransactions });
      message.success(t("toast.delete.success"));
    }
    toggleDeleteConfirm();
    setTransactionToDelete(null);
  };

  const onEditTransaction = (record: Transaction) => {
    setEditingTransaction(record);
    toggleProductModal();
  };

  const productTypeLabels: Record<string, string> = {
    "door-window": "ДО дверь",
    "door-deaf": "ДГ дверь",
    doorway: "Обшивочный проём",
    window: "Окно",
    windowsill: "Подоконник",
    "heated-floor": "Тёплый пол",
    latting: "Обрешётка",
  };

  const thresholdLabels: Record<string, string> = {
    no: "Нет",
    with: "С порогом",
    "with-low": "С порогом (низкий)",
    custom: "Вручную",
  };

  const openingLogicLabels: Record<string, string> = {
    "pull-right": "Наружное правое",
    "push-right": "Внутреннее правое",
    "pull-left": "Наружное левое",
    "push-left": "Внутреннее левое",
  };

  const sashLabels: Record<string, string> = {
    "1": "1 - Ствочатая",
    "2": "1.5 - Ствочатая",
    "3": "2 - Ствочатая",
    "4": "3 - Ствочатая",
    "5": "4 - Ствочатая",
  };

  const renderPrimitive = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    if (typeof value === "object") {
      const objectValue = value as Record<string, unknown>;
      if (objectValue?.name) {
        return String(objectValue.name ?? "-");
      }
      if (objectValue?.label) {
        return String(objectValue.label ?? "-");
      }
      return "-";
    }
    return String(value);
  };

  const columns: ColumnType<Transaction>[] = useMemo(
    () => [
      {
        title: "Местоположение",
        dataIndex: "location",
        render: (location: any) => {
          // Handle if location is a string (location_id or name)
          if (typeof location === "string") {
            return location || "-";
          }
          // Handle if location is an object with name property
          if (location && typeof location === "object" && "name" in location) {
            return location.name || "-";
          }
          return "-";
        },
      },
      {
        title: "Тип продукта",
        dataIndex: "product_type",
        render: (value: string) =>
          productTypeLabels[value] ?? renderPrimitive(value),
      },
      {
        title: "Высота проёма",
        dataIndex: "opening_height",
        render: (value: number) =>
          value === undefined || value === null ? "-" : String(value),
      },
      {
        title: "Ширина проёма",
        dataIndex: "opening_width",
        render: (value: number) =>
          value === undefined || value === null ? "-" : String(value),
      },
      {
        title: "Толщина проёма",
        dataIndex: "opening_thickness",
        render: (value: number) =>
          value === undefined || value === null ? "-" : String(value),
      },
      {
        title: "Количество элементов",
        dataIndex: "entity_quantity",
        render: (value: number) =>
          value === undefined || value === null ? "-" : String(value),
      },
      {
        title: "Каркас передний",
        dataIndex: "framework_front_id",
        width: 100,
        render: (_: unknown, record: Transaction) => {
          const framework = (record as any).framework_front;
          if (framework && typeof framework === "object") {
            if (framework.image_url) {
              return (
                <img
                  src={getAssetUrl(framework.image_url)}
                  alt={framework.name || "Каркас"}
                  className="h-12 w-12 object-contain"
                />
              );
            }
            if (framework.name) {
              return framework.name;
            }
          }
          return "-";
        },
      },
      {
        title: "Каркас задний",
        dataIndex: "framework_back_id",
        width: 100,
        render: (_: unknown, record: Transaction) => {
          const framework = (record as any).framework_back;
          if (framework && typeof framework === "object") {
            if (framework.image_url) {
              return (
                <img
                  src={getAssetUrl(framework.image_url)}
                  alt={framework.name || "Каркас"}
                  className="h-12 w-12 object-contain"
                />
              );
            }
            if (framework.name) {
              return framework.name;
            }
          }
          return "-";
        },
      },
      {
        title: "Логика открывания",
        dataIndex: "opening_logic",
        render: (value: string) =>
          openingLogicLabels[value] ?? renderPrimitive(value),
      },
      {
        title: "Распашка",
        dataIndex: "sash",
        render: (value: string) => sashLabels[value] ?? renderPrimitive(value),
      },
      {
        title: "Порог",
        dataIndex: "threshold",
        render: (value: string) =>
          thresholdLabels[value] ?? renderPrimitive(value),
      },
      {
        title: null,
        dataIndex: "action",
        fixed: "right",
        width: 50,
        render: (_: unknown, record: Transaction) => (
          <button
            type="button"
            className="flex items-center justify-center rounded p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDelete(record);
            }}
          >
            <Icon icon="trash" className="h-4 w-4" />
          </button>
        ),
      },
    ],
    [onEditTransaction, onOpenDelete, productTypeLabels, getAssetUrl],
  );

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    toggleProductModal();
  };

  const handleCloseModal = (confirmed?: boolean) => {
    // Only show success message if confirmed
    if (confirmed) {
      // Success message is already shown in TransactionDrawer
    }
    setEditingTransaction(null);
    toggleProductModal();
  };

  // Use Form.useWatch to reactively get transactions - this will trigger re-renders when form data changes
  const watchedTransactions = Form.useWatch("transactions", form) as
    | Transaction[]
    | undefined;
  const tableData = watchedTransactions?.length ? watchedTransactions : [];

  return (
    <div className={cn("relative py-1", className)}>
      {/* Hidden watcher to ensure form subscription */}
      <TransactionsWatcher />
      <TableWrapper<Transaction>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={tableData}
        rowKey={(record) => record._uid as string}
        columns={columns}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={handleAddTransaction}
        addButtonTestId="add-transaction-btn"
        onRow={(record) => ({
          onClick: () => onEditTransaction(record),
          className: "cursor-pointer hover:bg-gray-50",
        })}
      />

      <TransactionDrawer
        mode={editingTransaction ? "edit" : "add"}
        open={isAddProductModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
      />

      {/*{isAddProductModalOpen && (*/}
      {/*  <TransactionsModal*/}
      {/*    isOpen={isAddProductModalOpen}*/}
      {/*    closeModal={handleCloseModal}*/}
      {/*    title={*/}
      {/*      editingTransaction*/}
      {/*        ? t("bids.edit.transaction")*/}
      {/*        : t("bids.add.transaction")*/}
      {/*    }*/}
      {/*    initialValues={editingTransaction || undefined}*/}
      {/*  />*/}
      {/*)}*/}

      <ActionModal
        title={t("bids.delete.transaction.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type="warning"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
