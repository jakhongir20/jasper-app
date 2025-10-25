import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Color, ColorDeleteAction } from "@/features/admin/colors";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { ColorAddForm } from "@/features/admin/colors/crud/form/ColorAddForm";
import { ColorEditForm } from "@/features/admin/colors/crud/form/ColorEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: colors, isLoading } = useTableFetch<Color>("/color/all");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (color: Color) => {
    setSelectedColor(color);
    setOpenEdit(true);
  };

  const handleDelete = (color: Color) => {
    setSelectedColor(color);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedColor(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Color>
        data={colors || []}
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

      {/* Add Color Modal */}
      <ColorAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Color Modal */}
      <ColorEditForm
        open={openEdit}
        color={selectedColor}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedColor(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Color Modal */}
      <ColorDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        colorId={selectedColor?.color_id || 0}
      />
    </ContentInner>
  );
}
