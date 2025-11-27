import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Molding,
  MoldingAddForm,
  MoldingEditForm,
  MoldingDetails,
  DeleteAction,
} from "@/features/admin/moldings";
import { TableWrapper, ContentInner, Modal } from "@/shared/ui";
import { useTableFetch } from "@/shared/hooks";
import { useConfiguration } from "@/shared/contexts/ConfigurationContext";
import { columns } from "./TableColumn";

export default function Page() {
  const { tableData: moldings, isLoading } =
    useTableFetch<Molding>("/admin/framework/all");

  const { t } = useTranslation();
  const { getStaticAssetsBaseUrl } = useConfiguration();

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMolding, setSelectedMolding] = useState<Molding | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (molding: Molding) => {
    setSelectedMolding(molding);
    setOpenEdit(true);
  };

  const handleDelete = (molding: Molding) => {
    setSelectedMolding(molding);
    setOpenDelete(true);
  };

  const handleSuccess = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedMolding(null);
  };

  const handleCancel = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedMolding(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Molding>
        data={moldings || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenDelete: handleDelete,
          onOpenEdit: handleEdit,
          canEdit: true,
          canDelete: true,
          baseUrl: getStaticAssetsBaseUrl(),
        })}
        noFilter
        pagination={false}
        onAdd={handleAdd}
      />

      {/* Add Modal */}
      <MoldingAddForm
        open={openAdd}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />

      {/* Edit Modal */}
      {selectedMolding && (
        <MoldingEditForm
          open={openEdit}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          moldingId={selectedMolding.molding_id}
        />
      )}

      {/* Delete Modal */}
      {selectedMolding && (
        <DeleteAction
          open={openDelete}
          closeModal={handleCancel}
          moldingId={selectedMolding.molding_id}
          submit={handleSuccess}
        />
      )}
    </ContentInner>
  );
}
