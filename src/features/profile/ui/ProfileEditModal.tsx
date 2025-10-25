import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { useCurrentUser, useUpdateProfile, UpdateUserPayload } from "../model";
import { showGlobalToast } from "@/shared/hooks";
import { Modal } from "@/shared/ui";
import { ProfileForm } from "./ProfileForm";

interface Props {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    className?: string;
}

export const ProfileEditModal: FC<Props> = ({
    open,
    onCancel,
    onSuccess,
    className,
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const { data: user, isPending: isLoadingDetail } = useCurrentUser();

    const { mutate, isPending: isLoading } = useUpdateProfile({
        onSuccess: () => {
            showGlobalToast(t("common.messages.userUpdated"), "success");
            form.resetFields();
            onSuccess();
        },
        onError: (error: any) => {
            showGlobalToast(
                error?.response?.data?.message || t("common.messages.error"),
                "error",
            );
        },
    });

    // Set form values when detail data is loaded
    useEffect(() => {
        if (!isLoadingDetail && user && open) {
            const transformedData = {
                name: user.name,
                username: user.username,
                is_active: user.is_active ? 1 : 0,
                is_admin: user.is_admin ? 1 : 0,
                is_factory: user.is_factory ? 1 : 0,
                telegram_user_id: user.telegram_user_id,
                telegram_group_id: user.telegram_group_id,
            };

            form.setFieldsValue(transformedData);
        }
    }, [user, isLoadingDetail, form, open]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (values.password && values.password !== values.confirm_password) {
                showGlobalToast(t("common.messages.passwordMismatch"), "error");
                return;
            }

            const payload: UpdateUserPayload = {
                user_id: user?.user_id || 0,
                name: values.name,
                username: values.username,
                is_active: Boolean(values.is_active),
                is_admin: Boolean(values.is_admin),
                is_factory: Boolean(values.is_factory),
                telegram_user_id: values.telegram_user_id || 0,
                telegram_group_id: values.telegram_group_id,
            };

            // Only include password if it's provided
            if (values.password) {
                payload.password = values.password;
            }

            mutate(payload);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    if (isLoadingDetail) {
        return (
            <Modal
                title={t("common.labels.editUser")}
                open={open}
                onCancel={handleCancel}
                width={800}
            >
                <div className="flex h-32 items-center justify-center">
                    <div className="text-lg">{t("common.messages.loading")}</div>
                </div>
            </Modal>
        );
    }

    if (!user) {
        return (
            <Modal
                title={t("common.labels.editUser")}
                open={open}
                onCancel={handleCancel}
                width={800}
            >
                <div className="flex h-32 items-center justify-center">
                    <div className="text-lg text-red-500">
                        {t("common.messages.userNotFound")}
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title={t("common.labels.editUser")}
            open={open}
            onCancel={handleCancel}
            onSave={handleSave}
            okText={t("common.button.save")}
            cancelText={t("common.button.cancel")}
            confirmLoading={isLoading}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                className={cn(className)}
                scrollToFirstError
            >
                <ProfileForm isEdit={true} />
            </Form>
        </Modal>
    );
};

export default ProfileEditModal;
