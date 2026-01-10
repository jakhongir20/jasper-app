import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
  open: boolean;
  closeModal: () => void;
  branchId: number;
  submit?: () => void;
}

export const BranchDeleteAction: FC<Props> = ({
  open,
  closeModal,
  branchId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async ({ branch_id }: { branch_id: number }) => {
      return customInstance({
        url: `/admin/branch`,
        method: "DELETE",
        data: { branch_id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });

      toast(t("common.messages.branchDeleted"), "success");
      closeModal();
      submit?.();
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          t("common.messages.branchDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = async () => {
    if (branchId) {
      mutate({
        branch_id: branchId,
      });
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
      {t("common.messages.deleteBranch")}
    </ActionModal>
  );
};
