import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import React, { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDelete } from "@/features/purchase/no-ship/model/no-shipment.mutations";

interface Props {
  open: boolean;
  closeModal: () => void;
  guid: string;
  submit: () => void;
}

export const DeleteAction: FC<Props> = ({ open, closeModal, guid, submit }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableData"],
      });

      toast(t("common.toast.successDelete"), "success");
      closeModal();
      submit();
    },
  });

  const handleDelete = async () => {
    if (guid) {
      mutate(guid);
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
