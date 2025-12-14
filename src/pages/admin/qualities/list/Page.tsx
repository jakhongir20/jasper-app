import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Quality, QualityDeleteAction } from "@/features/admin/qualities";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { QualityAddForm } from "@/features/admin/qualities/crud/form/QualityAddForm";
import { QualityEditForm } from "@/features/admin/qualities/crud/form/QualityEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: qualities, isLoading } = useTableFetch<Quality>("/admin/quality/all");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (quality: Quality) => {
    setSelectedQuality(quality);
    setOpenEdit(true);
  };

  const handleDelete = (quality: Quality) => {
    setSelectedQuality(quality);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedQuality(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Quality>
        data={qualities || []}
        loading={isLoading}
        columns={columns(t, {
          onOpenEdit: handleEdit,
          onOpenDelete: handleDelete,
          canEdit: true,
          canDelete: true,
        })}
        pagination={false}
        onAdd={handleAdd}
        unhideableColumns={["name"]}
      />

      {/* Add Quality Modal */}
      <QualityAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Quality Modal */}
      {selectedQuality && (
        <QualityEditForm
          open={openEdit}
          qualityId={selectedQuality?.quality_id || 0}
          onCancel={() => {
            setOpenEdit(false);
            setSelectedQuality(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Quality Modal */}
      {selectedQuality && (
        <QualityDeleteAction
          open={openDelete}
          closeModal={() => {
            setOpenDelete(false);
            setSelectedQuality(null);
          }}
          qualityId={selectedQuality.quality_id}
        />
      )}
    </ContentInner>
  );
}
