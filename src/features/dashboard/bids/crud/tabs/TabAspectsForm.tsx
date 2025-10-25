import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { cn } from "@/shared/helpers";
import { useToggle } from "@/shared/hooks/useToggle";
import { ActionModal, TableWrapper } from "@/shared/ui";
import {
  ApplicationAspect as Aspect,
  ApplicationLocalForm,
} from "@/features/dashboard/bids/model";
import { useTableAspectColumns } from "@/features/dashboard/bids/constants/columns/TableAspectColumn";
import { AspectModal } from "@/features/dashboard/bids/crud/modal/AspectModal";
import { useToast } from "@/shared/hooks";

interface Props {
  className?: string;
  mode: "add" | "edit";
  isLoadingDetail?: boolean;
  navigateUrl?: string;
}

export const TabAspectsForm: FC<Props> = ({
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

  const [editingItem, setEditingItem] = useState<Aspect | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Aspect | null>(null);

  const onOpenDelete = (record: Aspect) => {
    setItemToDelete(record);
    toggleDeleteConfirm();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updatedItems = form
        .getFieldValue("aspects")
        ?.filter((item: Aspect) => item._uid !== itemToDelete._uid);

      form.setFieldsValue({ aspects: updatedItems });
      toast(t("toast.delete.success"), "success");
    }
    toggleDeleteConfirm();
    setItemToDelete(null);
  };

  const onEditItem = (record: Aspect) => {
    setEditingItem(record);
    toggleModal();
  };

  const columns = useTableAspectColumns({
    onDelete: onOpenDelete,
    onEdit: onEditItem,
    mode: mode,
  });

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
      <TableWrapper<Aspect>
        loading={isLoadingDetail && mode === "edit"}
        pagination={false}
        data={
          form.getFieldValue("aspects")?.length
            ? form.getFieldValue("aspects")
            : []
        }
        rowKey={(record) => record._uid as string}
        columns={columns}
        noFilter
        showSearch={false}
        showDropdown={false}
        onAdd={handleAddItem}
      />

      {isAddModalOpen && (
        <AspectModal
          isOpen={isAddModalOpen}
          closeModal={handleCloseModal}
          title={editingItem ? t("bids.edit.aspect") : t("bids.add.aspect")}
          initialValues={editingItem || undefined}
        />
      )}

      <ActionModal
        title={t("bids.delete.aspect.title")}
        open={isDeleteConfirmOpen}
        onCancel={toggleDeleteConfirm}
        loading={false}
        type={"warning"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
