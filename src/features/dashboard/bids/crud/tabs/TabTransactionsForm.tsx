import { type FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnType } from "antd/es/table";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableAction, TableWrapper } from "@/shared/ui";
import { Form, message } from "antd";
import {
  ApplicationLocalForm,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids/model";
import { TransactionDrawer } from "@/features/dashboard/bids/crud/tabs/TransactionDrawer";

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
    yes: "Да",
    no: "Нет",
    custom: "Кастомный",
  };

  const openingLogicLabels: Record<string, string> = {
    left: "Левое",
    right: "Правое",
    up: "Вверх",
    down: "Вниз",
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
        title: null,
        dataIndex: "action",
        fixed: "right",
        render: (_: unknown, record: Transaction) => (
          <div className="flex flex-col gap-1">
            <TableAction
              showEdit
              showDelete
              onEdit={() => onEditTransaction(record)}
              onDelete={() => onOpenDelete(record)}
            />
          </div>
        ),
      },
    ],
    [onEditTransaction, onOpenDelete, productTypeLabels],
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

  return (
    <div className={cn("relative py-1", className)}>
      <TableWrapper<Transaction>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("transactions")?.length
            ? form.getFieldValue("transactions")
            : []
        }
        rowKey={(record) => record._uid as string}
        columns={columns}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={handleAddTransaction}
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
