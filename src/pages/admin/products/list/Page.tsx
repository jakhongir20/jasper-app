import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Product } from "@/features/admin/products";
import { DeleteAction } from "@/features/admin/products";
import { columns } from "./TableColumn";
import { useTableFetch } from "@/shared/hooks";
import { TableWrapper, ContentInner } from "@/shared/ui";

export default function Page() {
  const { tableData: products, isLoading, pagination, onPageChange } = useTableFetch<Product>(
    "/admin/product/all",
    {},
    ["tab", "page"],
    false,
    20,
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdd = () => {
    navigate(`/admin/products/add`);
  };

  const handleOpen = (row: Product) => {
    navigate(`/admin/products/${row.product_id}`);
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const onDelete = (data: Product) => {
    setOpenDelete(true);
    setSelectedProduct(data);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Product>
        data={products || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: onDelete,
          canEdit: true,
          canDelete: true,
        })}
        unhideableColumns={["product_id"]}
        // clickableColumns={["name", "product_id"]}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
        }}
        noFilter
        onAdd={handleAdd}
      // onRowClick={handleOpen}
      />

      <DeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        productId={selectedProduct?.product_id || 0}
      />
    </ContentInner>
  );
}
