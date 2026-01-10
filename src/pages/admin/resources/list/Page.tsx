import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Resource, ResourceDeleteAction } from "@/features/admin/resources";
import { TableWrapper, ContentInner } from "@/shared/ui";
import { columns } from "./TableColumn";
import { ResourceAddForm } from "@/features/admin/resources/crud/form/ResourceAddForm";
import { ResourceEditForm } from "@/features/admin/resources/crud/form/ResourceEditForm";
import { useTableFetch } from "@/shared/hooks";

export default function Page() {
  const { tableData: resources, isLoading } = useTableFetch<Resource>("/admin/resource/all");
  const { t } = useTranslation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setOpenEdit(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setOpenDelete(true);
  };

  const handleAddSuccess = () => {
    setOpenAdd(false);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setSelectedResource(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Resource>
        data={resources || []}
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

      {/* Add Resource Modal */}
      <ResourceAddForm
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Resource Modal */}
      {selectedResource && (
        <ResourceEditForm
          open={openEdit}
          resourceId={selectedResource?.resource_id || 0}
          onCancel={() => {
            setOpenEdit(false);
            setSelectedResource(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Resource Modal */}
      <ResourceDeleteAction
        open={openDelete}
        closeModal={() => setOpenDelete(false)}
        resourceId={selectedResource?.resource_id || 0}
      />
    </ContentInner>
  );
}
