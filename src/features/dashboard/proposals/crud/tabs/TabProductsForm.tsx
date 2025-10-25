import type { FormInstance } from "antd";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductsModal } from "@/features/purchase/no-ship/crud/modal/ProductsModal";
import type {
  Product,
  Taxes,
} from "@/features/purchase/no-ship/model/no-shipment.types";
import {
  useGetDiscounts,
  useGetTaxes,
} from "@/features/purchase/purchases/model";
import { columns } from "@/pages/purchase/no-ship/details/TableColumn";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { TableWrapper } from "@/shared/ui";

interface Props {
  className?: string;
  form: FormInstance;
  groupTitle?: string;
  mode: "add" | "edit";
  id?: number;
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabProductsForm: FC<Props> = ({
  className,
  form,
  mode,
  id,
  isLoadingDetail = false,
}) => {
  const { t } = useTranslation();
  const { isOpen: isAddProductModalOpen, toggle: toggleProductModal } =
    useToggle();
  const { data: taxes, isPending: isLoadingTaxes } = useGetTaxes();
  const { data: discounts, isPending: isLoadingDiscounts } = useGetDiscounts();

  const [deletedProductIDs, setDeletedProductIDs] = useState<number[]>([]);
  const [count, setCount] = useState(0);

  const handleDelete = (record: Product) => {
    if (record.id) {
      setDeletedProductIDs((prev) => [...prev, record.id]);
    }

    const products = form.getFieldValue("products") || [];
    const filtered = products.filter(
      (item: Product) => item._uid !== record._uid,
    );
    form.setFieldsValue({ products: filtered });
  };

  useEffect(() => {
    if (mode === "edit" && deletedProductIDs.length) {
      form.setFieldsValue({ deleteProducts: deletedProductIDs });
    }
  }, [deletedProductIDs, mode]);

  useEffect(() => {
    if (!isLoadingDetail && id) {
      setCount((prev) => prev + 1);
    }
  }, [isLoadingDetail, id]);

  return (
    <div className={cn("relative py-1", className)}>
      <TableWrapper<Product>
        key={count}
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("products")?.length
            ? form.getFieldValue("products")
            : []
        }
        rowKey={(record) => record._uid as string}
        columns={columns(
          t,
          form,
          taxes as Taxes,
          discounts as Taxes,
          isLoadingTaxes,
          isLoadingDiscounts,
          handleDelete,
          mode,
        )}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={toggleProductModal}
      />

      <ProductsModal
        isOpen={isAddProductModalOpen}
        closeModal={toggleProductModal}
        form={form}
        mode={mode}
        title={t("purchaseModule.add.addProduct")}
      />
    </div>
  );
};
