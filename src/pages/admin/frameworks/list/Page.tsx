import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Framework,
  FrameworkAddForm,
  FrameworkEditForm,
  FrameworkDetails,
  DeleteAction,
} from "@/features/admin/frameworks";
import { TableWrapper, ContentInner, Modal } from "@/shared/ui";
import { useTableFetch } from "@/shared/hooks";
import { useConfiguration } from "@/shared/contexts/ConfigurationContext";
import { columns } from "./TableColumn";

export default function Page() {
  const { tableData: frameworks, isLoading } =
    useTableFetch<Framework>("/framework/all");

  const { t } = useTranslation();
  const { getStaticAssetsBaseUrl } = useConfiguration();

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (framework: Framework) => {
    setSelectedFramework(framework);
    setOpenEdit(true);
  };

  const handleDelete = (framework: Framework) => {
    setSelectedFramework(framework);
    setOpenDelete(true);
  };

  const handleSuccess = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedFramework(null);
  };

  const handleCancel = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedFramework(null);
  };

  return (
    <ContentInner className="mb-10">
      <TableWrapper<Framework>
        data={frameworks || []}
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
      <FrameworkAddForm
        open={openAdd}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />

      {/* Edit Modal */}
      {selectedFramework && (
        <FrameworkEditForm
          open={openEdit}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          frameworkId={selectedFramework.framework_id}
        />
      )}

      {/* Delete Modal */}
      {selectedFramework && (
        <DeleteAction
          open={openDelete}
          closeModal={handleCancel}
          frameworkId={selectedFramework.framework_id}
          submit={handleSuccess}
        />
      )}
    </ContentInner>
  );
}
