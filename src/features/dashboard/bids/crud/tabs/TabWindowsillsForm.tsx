import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationLocalForm,
  ApplicationWindowsill,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableWindowSillColumn";
import { useToast } from "@/shared/hooks";
import { WindowSillModal } from "@/features/dashboard/bids/crud/modal/WindowsillModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabWindowsillsForm: FC<Props> = ({
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

  const [editingItem, setEditingItem] = useState<ApplicationWindowsill | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] =
    useState<ApplicationWindowsill | null>(null);

  const onOpenDelete = (record: ApplicationWindowsill) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("windowsills")
        ?.filter(
          (item: ApplicationWindowsill) => item._uid !== itemToDelete._uid,
        );

      form.setFieldsValue({ windowsills: updatedItems });
      toast(t("toast.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationWindowsill) => {
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
      <TableWrapper<ApplicationWindowsill>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("windowsills")?.length
            ? form.getFieldValue("windowsills")
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
        <WindowSillModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={
            editingItem ? t("bids.edit.windowsill") : t("bids.add.windowsill")
          }
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.windowsill.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
