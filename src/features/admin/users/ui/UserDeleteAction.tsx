import { ActionModal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import type { FC } from "react";
import { useToast } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "../model/user.mutations";

interface Props {
    open: boolean;
    closeModal: () => void;
    userId: number;
    submit?: () => void;
}

export const UserDeleteAction: FC<Props> = ({
    open,
    closeModal,
    userId,
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
        if (userId) {
            mutate(userId);
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
            {t("common.messages.deleteUserConfirmation")}
        </ActionModal>
    );
};
