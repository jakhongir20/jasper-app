import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMolding } from "@/features/admin/moldings/model/molding.mutations";

interface Props {
  open: boolean;
  closeModal: () => void;
  moldingId: number;
  submit?: () => void;
}

export const DeleteAction: FC<Props> = ({
  open,
  closeModal,
  moldingId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useDeleteMolding({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });

      toast(t("toast.successDelete"), "success");
      closeModal();
      submit?.();
    },
    onError: (error: any) => {
      toast(
        error?.message || t("common.messages.moldingDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = async () => {
    if (moldingId) {
      mutate(moldingId);
    }
  };

  return (
    <ActionModal
      loading={isLoading}
      type={"warning"}
      open={open}
      onCancel={closeModal}
      onConfirm={handleDelete}
    />
  );
};
