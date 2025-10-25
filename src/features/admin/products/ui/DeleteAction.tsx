import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProduct } from "@/features/admin/products/model/product.mutations";

interface Props {
  open: boolean;
  closeModal: () => void;
  productId: number;
  submit?: () => void;
}

export const DeleteAction: FC<Props> = ({
  open,
  closeModal,
  productId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useDeleteProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });

      toast(t("toast.successDelete"), "success");
      closeModal();
      submit?.();
    },
  });

  const handleDelete = async () => {
    if (productId) {
      mutate(productId);
    }
  };

  return (
    <ActionModal
      loading={isLoading}
      type={"warning"}
      open={open}
      onCancel={closeModal}
      onConfirm={handleDelete}
      showTitle={true}
    >
      {t("common.messages.deleteProductConfirmation")}
    </ActionModal>
  );
};
