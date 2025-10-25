import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { showGlobalToast } from "@/shared/hooks";
import { ActionModal } from "@/shared/ui";
import { useDeleteCategory } from "../model";

interface Props {
  open: boolean;
  closeModal: () => void;
  categoryId: number;
  categoryTitle?: string;
}

export const CategoryDeleteAction: FC<Props> = ({
  open,
  closeModal,
  categoryId,
  categoryTitle = "",
}) => {
  const { t } = useTranslation();

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory({
    onSuccess: () => {
      showGlobalToast(t("common.messages.categoryDeleted"), "success");
      closeModal();
    },
    onError: (error) => {
      showGlobalToast(
        error?.response?.data?.message ||
          t("common.messages.categoryDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = () => {
    deleteCategory(categoryId);
  };

  return (
    <ActionModal
      type="warning"
      open={open}
      onConfirm={handleDelete}
      onCancel={closeModal}
      loading={isDeleting}
      showTitle={true}
    >
      <p>
        {t("common.modal.deleteConfirmation", {
          item: categoryTitle || t("common.messages.thisCategory"),
        })}
      </p>
    </ActionModal>
  );
};
