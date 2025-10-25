import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, message } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationLatting,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableLattingColumn";
import { LattingsModal } from "@/features/dashboard/bids/crud/modal/LattingModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabLattingsForm: FC<Props> = ({
  className,
  mode,
  isLoadingDetail = false,
}) => {
  const form = Form.useFormInstance<ApplicationLocalForm>();
  const { t } = useTranslation();
  const { isOpen: isAddModalOpen, toggle: toggleModal } = useToggle();
  const { isOpen: isDeleteConfirmOpen, toggle: toggleDeleteConfirm } =
    useToggle();

  const [editingItem, setEditingItem] = useState<ApplicationLatting | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<ApplicationLatting | null>(
    null,
  );

  const onOpenDelete = (record: ApplicationLatting) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("lattings")
        ?.filter((item: ApplicationLatting) => item._uid !== itemToDelete._uid);

      form.setFieldsValue({ lattings: updatedItems });
      message.success(t("toast.delete.success"));
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationLatting) => {
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
      <TableWrapper<ApplicationLatting>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("lattings")?.length
            ? form.getFieldValue("lattings")
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
        <LattingsModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={editingItem ? t("bids.edit.latting") : t("bids.add.latting")}
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.latting.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
