import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
    open: boolean;
    closeModal: () => void;
    factoryStatusId: number;
    submit?: () => void;
}

export const FactoryStatusDeleteAction: FC<Props> = ({
    open,
    closeModal,
    factoryStatusId,
    submit,
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: async ({ factory_status_id }: { factory_status_id: number }) => {
            return customInstance({
                url: `/admin/factory-status?factory_status_id=${factory_status_id}`,
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
                t("common.messages.factoryStatusDeleteFailed"),
                "error",
            );
        },
    });

    const handleDelete = async () => {
        if (factoryStatusId) {
            mutate({
                factory_status_id: factoryStatusId,
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
            {t("common.messages.deleteFactoryStatusConfirmation")}
        </ActionModal>
    );
};
