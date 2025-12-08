import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
    open: boolean;
    closeModal: () => void;
    qualityId: number;
    submit?: () => void;
}

export const QualityDeleteAction: FC<Props> = ({
    open,
    closeModal,
    qualityId,
    submit,
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: async ({ quality_id }: { quality_id: number }) => {
            return customInstance({
                url: `/admin/quality?quality_id=${quality_id}`,
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tableData"],
            });

            toast(t("common.messages.qualityDeleted"), "success");
            closeModal();
            submit?.();
        },
        onError: (error: any) => {
            toast(
                error?.response?.data?.message ||
                t("common.messages.qualityDeleteFailed"),
                "error",
            );
        },
    });

    const handleDelete = async () => {
        if (qualityId) {
            mutate({
                quality_id: qualityId,
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
            {t("common.messages.deleteQualityConfirmation")}
        </ActionModal>
    );
};
