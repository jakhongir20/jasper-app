import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationFramework,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableFrameworkColumn";
import { useToast } from "@/shared/hooks";
import { FrameworkModal } from "@/features/dashboard/bids/crud/modal/FrameworkModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabFrameworksForm: FC<Props> = ({
  className,
  mode,
  isLoadingDetail = false,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isOpen: isAddModalOpen, toggle: toggleModal } = useToggle();
  const { isOpen: isDeleteConfirmOpen, toggle: toggleDeleteConfirm } =
    useToggle();

  const [editingItem, setEditingItem] = useState<ApplicationFramework | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<ApplicationFramework | null>(
    null,
  );

  const onOpenDelete = (record: ApplicationFramework) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("frameworks")
        ?.filter(
          (item: ApplicationFramework) => item._uid !== itemToDelete._uid,
        );

      form.setFieldsValue({ frameworks: updatedItems });
      toast(t("toast.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationFramework) => {
    setEditingItem(record);
    toggleModal();
  };

  const handleAddItem = () => {
    setEditingItem(null);
    toggleModal();
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    toggleModal();
  };

  return (
    <div className={cn("relative py-1", className)}>
      <TableWrapper<ApplicationFramework>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("frameworks")?.length
            ? form.getFieldValue("frameworks")
            : []
        }
        rowKey={(record) => record._uid as string}
        columns={columns({
          onDelete: onOpenDelete,
          onEdit: onEditItem,
          mode: mode,
        })}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={handleAddItem}
      />

      {isAddModalOpen && (
        <FrameworkModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={
            editingItem ? t("bids.edit.framework") : t("bids.add.framework")
          }
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.framework.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
