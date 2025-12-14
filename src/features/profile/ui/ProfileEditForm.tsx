import { Form, Switch, Button, Card, message } from "antd";
import { Input, NumberInput } from "@/shared/ui";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCurrentUser, useUpdateProfile } from "../model";
import { showGlobalToast } from "@/shared/hooks";

export const ProfileEditForm: React.FC = () => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: user, isLoading: isLoadingUser } = useCurrentUser();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile({
        onSuccess: () => {
            showGlobalToast(t("profile.messages.updateSuccess"), "success");
            navigate("/profile");
        },
        onError: (error: any) => {
            showGlobalToast(
                error?.response?.data?.message || t("profile.messages.updateError"),
                "error"
            );
        },
    });

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                username: user.username,
                is_active: user.is_active,
                is_admin: user.is_admin,
                is_factory: user.is_factory,
                telegram_user_id: user.telegram_user_id,
                telegram_group_id: user.telegram_group_id,
            });
        }
    }, [user, form]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            const payload = {
                user_id: user?.user_id || 0,
                name: values.name,
                username: values.username,
                is_active: values.is_active,
                is_admin: values.is_admin,
                is_factory: values.is_factory,
                telegram_user_id: values.telegram_user_id || 0,
                telegram_group_id: values.telegram_group_id,
            };

            updateProfile(payload);
        });
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    if (isLoadingUser) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">{t("common.loading")}</div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">{t("profile.editTitle")}</span>
                        <div className="flex gap-2">
                            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
                                {t("common.button.cancel")}
                            </Button>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={isUpdating}
                                onClick={handleSave}
                            >
                                {t("common.button.save")}
                            </Button>
                        </div>
                    </div>
                }
                className="shadow-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="max-w-2xl"
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label={t("profile.fields.name")}
                        rules={[
                            { required: true, message: t("profile.validation.nameRequired") },
                            { min: 2, message: t("profile.validation.nameMinLength") },
                        ]}
                    >
                        <Input placeholder={t("profile.placeholders.name")} />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label={t("profile.fields.username")}
                        rules={[
                            { required: true, message: t("profile.validation.usernameRequired") },
                            { min: 3, message: t("profile.validation.usernameMinLength") },
                        ]}
                    >
                        <Input placeholder={t("profile.placeholders.username")} />
                    </Form.Item>

                    <Form.Item
                        name="telegram_user_id"
                        label={t("profile.fields.telegramId")}
                        rules={[
                            { type: "number", message: t("profile.validation.telegramIdNumber") },
                        ]}
                    >
                        <NumberInput
                            min={0}
                            placeholder={t("profile.placeholders.telegramId")}
                        />
                    </Form.Item>

                    <Form.Item
                        name="telegram_group_id"
                        label={t("profile.fields.telegramGroupId")}
                        rules={[
                            { type: "number", message: t("profile.validation.telegramGroupIdNumber") },
                        ]}
                    >
                        <NumberInput
                            min={0}
                            placeholder={t("profile.placeholders.telegramGroupId")}
                        />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="is_active"
                            label={t("profile.fields.status")}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="is_admin"
                            label={t("profile.fields.adminRole")}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="is_factory"
                            label={t("profile.fields.factoryRole")}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ProfileEditForm;
