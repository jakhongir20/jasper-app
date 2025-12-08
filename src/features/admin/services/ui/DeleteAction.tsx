import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
    open: boolean;
    closeModal: () => void;
    serviceId: number;
    submit?: () => void;
}

export const ServiceDeleteAction: FC<Props> = ({
    open,
    closeModal,
    serviceId,
    submit,
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: async ({ service_id }: { service_id: number }) => {
            return customInstance({
                url: `/admin/service?service_id=${service_id}`,
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tableData"],
            });

            toast(t("common.messages.serviceDeleted"), "success");
            closeModal();
            submit?.();
        },
        onError: (error: any) => {
            toast(
                error?.response?.data?.message ||
                t("common.messages.serviceDeleteFailed"),
                "error",
            );
        },
    });

    const handleDelete = async () => {
        if (serviceId) {
            mutate({
                service_id: serviceId,
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
            {t("common.messages.deleteServiceConfirmation")}
        </ActionModal>
    );
};
