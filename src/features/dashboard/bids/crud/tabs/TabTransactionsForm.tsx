import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { TransactionsModal } from "@/features/dashboard/bids/crud/modal/TransactionsModal";
import { useTableTransactionColumns } from "@/features/dashboard/bids/constants/columns/TableTransactionColumn";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import { Form, message } from "antd";
import {
  ApplicationLocalForm,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids/model";

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

  const columns = useTableTransactionColumns({
    onDelete: onOpenDelete,
    onEdit: onEditTransaction,
    mode: mode,
  });

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    toggleProductModal();
  };

  const handleCloseModal = () => {
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

      {isAddProductModalOpen && (
        <TransactionsModal
          isOpen={isAddProductModalOpen}
          closeModal={handleCloseModal}
          title={
            editingTransaction
              ? t("bids.edit.transaction")
              : t("bids.add.transaction")
          }
          initialValues={editingTransaction || undefined}
        />
      )}

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
