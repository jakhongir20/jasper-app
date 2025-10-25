import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { customInstance } from "@/shared/lib/api";

interface Props {
    open: boolean;
    closeModal: () => void;
    colorId: number;
    submit?: () => void;
}

export const ColorDeleteAction: FC<Props> = ({
    open,
    closeModal,
    colorId,
    submit,
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: async ({ color_id }: { color_id: number }) => {
            return customInstance({
                url: `/admin/color?color_id=${color_id}`,
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
                t("common.messages.colorDeleteFailed"),
                "error",
            );
        },
    });

    const handleDelete = async () => {
        if (colorId) {
            mutate({
                color_id: colorId,
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
            {t("common.messages.deleteColorConfirmation")}
        </ActionModal>
    );
};
