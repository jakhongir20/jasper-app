import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
  open: boolean;
  closeModal: () => void;
  customerId: number;
  submit?: () => void;
}

export const CustomerDeleteAction: FC<Props> = ({
  open,
  closeModal,
  customerId,
  submit,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async ({ customer_id }: { customer_id: number }) => {
      return customInstance({
        url: `/admin/customer?customer_id=${customer_id}`,
        method: 'DELETE',
      });
    },
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
        error?.response?.data?.message ||
        t("common.messages.customerDeleteFailed"),
        "error",
      );
    },
  });

  const handleDelete = async () => {
    if (customerId) {
      mutate({
        customer_id: customerId,
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
      {t("common.messages.deleteCustomerConfirmation")}
    </ActionModal>
  );
};
