import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationDecoration,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableDecorationColumn";
import { useToast } from "@/shared/hooks";
import { DecorationModal } from "@/features/dashboard/bids/crud/modal/DecorationModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabDecorationsForm: FC<Props> = ({
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

  const [editingItem, setEditingItem] = useState<ApplicationDecoration | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] =
    useState<ApplicationDecoration | null>(null);

  const onOpenDelete = (record: ApplicationDecoration) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("decorations")
        ?.filter(
          (item: ApplicationDecoration) => item._uid !== itemToDelete._uid,
        );

      form.setFieldsValue({ decorations: updatedItems });
      toast(t("toast.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationDecoration) => {
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
      <TableWrapper<ApplicationDecoration>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("decorations")?.length
            ? form.getFieldValue("decorations")
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
        <DecorationModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={
            editingItem ? t("bids.edit.decoration") : t("bids.add.decoration")
          }
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.decoration.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
