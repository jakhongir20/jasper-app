import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type CustomerOutputEntity } from "@/shared/lib/api";
import { useTableFetch } from "@/shared/hooks";
import { ContentInner, TableWrapper } from "@/shared/ui";
import { columns } from "./TableColumn";
import { CustomerDeleteAction } from "@/features/admin/customers/ui/CustomerDeleteAction";
import { CustomerAddForm } from "@/features/admin/customers/crud/form/CustomerAddForm";
import { CustomerEditForm } from "@/features/admin/customers/crud/form/CustomerEditForm";

export default function Page() {
  const {
    tableData: customers,
    isLoading,
    pagination,
  } = useTableFetch<CustomerOutputEntity>("/admin/customer/all");

  const { t } = useTranslation();

  // Removed handleOpen since we don't need single page for clients

  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOutputEntity | null>(null);

  const onDelete = (data: CustomerOutputEntity) => {
    setOpenDelete(true);
    setSelectedCustomer(data);
  };

  const onEdit = (data: CustomerOutputEntity) => {
    setSelectedCustomer(data);
    setOpenEdit(true);
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedCustomer(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<CustomerOutputEntity>
        data={customers as CustomerOutputEntity[]}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: onDelete,
          onOpenEdit: onEdit,
          canDelete: true,
          canEdit: true,
        })}
        noFilter
        pagination={pagination}
        onAdd={handleAddClick}
      />

      <CustomerDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        customerId={selectedCustomer?.customer_id || 0}
      />

      {/* Add Customer Modal */}
      <CustomerAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Customer Modal */}
      <CustomerEditForm
        open={openEdit}
        customer={selectedCustomer}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedCustomer(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </ContentInner>
  );
}
