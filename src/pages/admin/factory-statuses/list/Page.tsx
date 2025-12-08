import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FactoryStatus, FactoryStatusDeleteAction } from "@/features/admin/factory-statuses";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { FactoryStatusAddForm } from "@/features/admin/factory-statuses/crud/form/FactoryStatusAddForm";
import { FactoryStatusEditForm } from "@/features/admin/factory-statuses/crud/form/FactoryStatusEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: factoryStatuses, isLoading } = useTableFetch<FactoryStatus>("/admin/factory-status/all", "POST");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFactoryStatus, setSelectedFactoryStatus] = useState<FactoryStatus | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (factoryStatus: FactoryStatus) => {
    setSelectedFactoryStatus(factoryStatus);
    setOpenEdit(true);
  };

  const handleDelete = (factoryStatus: FactoryStatus) => {
    setSelectedFactoryStatus(factoryStatus);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedFactoryStatus(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<FactoryStatus>
        data={factoryStatuses || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenEdit: handleEdit,
          onOpenDelete: handleDelete,
          canEdit: true,
          canDelete: true,
        })}
        pagination={false}
        onAdd={handleAdd}
        noFilter
        unhideableColumns={["name"]}
      />

      {/* Add FactoryStatus Modal */}
      <FactoryStatusAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit FactoryStatus Modal */}
      <FactoryStatusEditForm
        open={openEdit}
        factoryStatusId={selectedFactoryStatus?.factory_status_id || 0}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedFactoryStatus(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Delete FactoryStatus Modal */}
      <FactoryStatusDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        factoryStatusId={selectedFactoryStatus?.factory_status_id || 0}
      />
    </ContentInner>
  );
}
