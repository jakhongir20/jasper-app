import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TransactionsModal } from "@/features/dashboard/bids/crud/modal/TransactionsModal";
import type {
  ApplicationLocalForm,
  TransactionFormType,
  Taxes,
} from "@/features/dashboard/bids/model/bids.types";
import { useTableTransactionColumns } from "@/features/dashboard/bids/constants/columns/TableTransactionColumn";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { TableWrapper } from "@/shared/ui";
import { Form } from "antd";

interface Props {
  className?: string;
  groupTitle?: string;
  mode: "add" | "edit";
  id?: number;
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabProductsForm: FC<Props> = ({
  className,
  mode,
  id,
  isLoadingDetail = false,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();

  const { t } = useTranslation();
  const { isOpen: isAddProductModalOpen, toggle: toggleProductModal } =
    useToggle();
  const { data: taxes, isPending: isLoadingTaxes } = {
    data: [],
    isPending: false,
  }; // Replace with actual data fetching logic
  const { data: discounts, isPending: isLoadingDiscounts } = {
    data: [],
    isPending: false,
  }; // Replace with actual data fetching logic

  const [deletedProductIDs, setDeletedProductIDs] = useState<number[]>([]);
  const [count, setCount] = useState(0);

  const handleDelete = (record: TransactionFormType) => {
    if (record.id) {
      setDeletedProductIDs((prev) => [...prev, record.id!]);
    }

    const products = form.getFieldValue("transactions") || [];
    const filtered = products.filter(
      (item: TransactionFormType) => item._uid !== record._uid,
    );
    form.setFieldsValue({ transactions: filtered });
  };

  const columns = useTableTransactionColumns({
    onDelete: handleDelete,
    onEdit: () => {}, // Add proper edit handler if needed
    mode: mode,
  });

  useEffect(() => {
    if (mode === "edit" && deletedProductIDs.length) {
      // Handle deleted transactions if needed
    }
  }, [deletedProductIDs, mode]);

  useEffect(() => {
    if (!isLoadingDetail && id) {
      setCount((prev) => prev + 1);
    }
  }, [isLoadingDetail, id]);

  return (
    <div className={cn("relative py-1", className)}>
      <TableWrapper<TransactionFormType>
        key={count}
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
        onAdd={toggleProductModal}
      />

      {isAddProductModalOpen && (
        <TransactionsModal
          isOpen={isAddProductModalOpen}
          closeModal={toggleProductModal}
          form={form}
          mode={mode}
          title={t("purchaseModule.add.addProduct")}
        />
      )}
    </div>
  );
};
