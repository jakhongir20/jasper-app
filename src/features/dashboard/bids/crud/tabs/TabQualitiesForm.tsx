import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationAdditionalQuality,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { columns } from "@/features/dashboard/bids/constants/columns/TableQualityColumn";
import { useToast } from "@/shared/hooks";
import { QualityModal } from "@/features/dashboard/bids/crud/modal/QualityModal";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabQualitiesForm: FC<Props> = ({
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

  const [editingItem, setEditingItem] =
    useState<ApplicationAdditionalQuality | null>(null);
  const [itemToDelete, setItemToDelete] =
    useState<ApplicationAdditionalQuality | null>(null);

  const onOpenDelete = (record: ApplicationAdditionalQuality) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("application_qualities")
        ?.filter(
          (item: ApplicationAdditionalQuality) =>
            item._uid !== itemToDelete._uid,
        );

      form.setFieldsValue({ application_qualities: updatedItems });
      toast(t("toast.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: ApplicationAdditionalQuality) => {
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
      <TableWrapper<ApplicationAdditionalQuality>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("application_qualities")?.length
            ? form.getFieldValue("application_qualities")
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
        <QualityModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={editingItem ? t("bids.edit.quality") : t("bids.add.quality")}
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.service.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
