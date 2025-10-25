import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useTableFetch } from "@/shared/hooks";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import {
  CategoryDeleteAction,
  CategoryAddForm,
  CategoryEditForm,
  type Category,
} from "@/features/admin/categories";

export default function Page() {
  const {
    tableData: categories,
    isLoading,
    pagination,
  } = useTableFetch<Category>("/category/all");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdd = () => {
    navigate(`/admin/categories/add`);
  };

  // Removed handleOpen since we don't need single page for categories

  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const onDelete = (data: Category) => {
    setOpenDelete(true);
    setSelectedCategory(data);
  };

  const onEdit = (data: Category) => {
    setSelectedCategory(data);
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
    setSelectedCategory(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Category>
        data={categories as Category[]}
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

      <CategoryDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        categoryId={selectedCategory?.category_id || 0}
        categoryTitle={selectedCategory?.name}
      />

      {/* Add Category Modal */}
      <CategoryAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Category Modal */}
      <CategoryEditForm
        open={openEdit}
        category={selectedCategory}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedCategory(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </ContentInner>
  );
}
