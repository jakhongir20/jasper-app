import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteFramework } from "@/features/admin/frameworks/model/framework.mutations";

interface Props {
  open: boolean;
  closeModal: () => void;
  frameworkId: number;
  submit?: () => void;
}

export const DeleteAction: FC<Props> = ({
  open,
  closeModal,
  frameworkId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useDeleteFramework({
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
        error?.message || t("common.messages.frameworkDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = async () => {
    if (frameworkId) {
      mutate(frameworkId);
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
