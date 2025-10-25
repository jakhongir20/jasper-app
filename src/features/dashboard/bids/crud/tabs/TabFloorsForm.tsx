import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationFloor,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableFloorColumn";
import { useToast } from "@/shared/hooks";
import { FloorModal } from "@/features/dashboard/bids/crud/modal/FloorModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabFloorsForm: FC<Props> = ({
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

  const [editingItem, setEditingItem] = useState<ApplicationFloor | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ApplicationFloor | null>(
    null,
  );

  const onOpenDelete = (record: ApplicationFloor) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("floors")
        ?.filter((item: ApplicationFloor) => item._uid !== itemToDelete._uid);

      form.setFieldsValue({ floors: updatedItems });
      toast(t("toast.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationFloor) => {
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
      <TableWrapper<ApplicationFloor>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("floors")?.length
            ? form.getFieldValue("floors")
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
        <FloorModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={editingItem ? t("bids.edit.floor") : t("bids.add.floor")}
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.floor.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
