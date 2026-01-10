import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Branch, BranchDeleteAction } from "@/features/admin/branches";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { BranchAddForm } from "@/features/admin/branches/crud/form/BranchAddForm";
import { BranchEditForm } from "@/features/admin/branches/crud/form/BranchEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: branches, isLoading } = useTableFetch<Branch>("/admin/branch/all");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenEdit(true);
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedBranch(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Branch>
        data={branches || []}
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

      {/* Add Branch Modal */}
      <BranchAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Branch Modal */}
      {selectedBranch && (
        <BranchEditForm
          open={openEdit}
          branchId={selectedBranch?.branch_id || 0}
          onCancel={() => {
            setOpenEdit(false);
            setSelectedBranch(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Branch Modal */}
      <BranchDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        branchId={selectedBranch?.branch_id || 0}
      />
    </ContentInner>
  );
}
