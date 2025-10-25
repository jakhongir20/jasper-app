import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "@/features/admin/users/model/user.mutations";

interface Props {
  open: boolean;
  closeModal: () => void;
  url: string;
  params: {
    id: string | number;
    key: string;
  };
  submit?: () => void;
}

export const DeleteAction: FC<Props> = ({
  open,
  closeModal,
  params,
  url,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useDeleteUser({
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
    if (params.id) {
      mutate(Number(params.id));
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
