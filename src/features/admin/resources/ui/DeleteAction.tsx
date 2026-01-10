import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
  open: boolean;
  closeModal: () => void;
  resourceId: number;
  submit?: () => void;
}

export const ResourceDeleteAction: FC<Props> = ({
  open,
  closeModal,
  resourceId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async ({ resource_id }: { resource_id: number }) => {
      return customInstance({
        url: `/admin/resource?resource_id=${resource_id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });

      toast(t("common.messages.resourceDeleted"), "success");
      closeModal();
      submit?.();
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          t("common.messages.resourceDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = async () => {
    if (resourceId) {
      mutate({
        resource_id: resourceId,
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
      {t("common.messages.deleteResource")}
    </ActionModal>
  );
};
