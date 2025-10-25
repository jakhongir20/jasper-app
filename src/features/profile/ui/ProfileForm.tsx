import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import { Input, InputPassword, Select } from "@/shared/ui";
import { User } from "@/features/admin/users/model/model.types";

interface Props {
    className?: string;
    initialValues?: Partial<User>;
    isEdit?: boolean;
}

export const ProfileForm: FC<Props> = ({
    className,
    initialValues,
    isEdit = false,
}) => {
    const { t } = useTranslation();

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2">
                <Form.Item
                    name="name"
                    label={t("common.labels.name")}
                    rules={[{ required: true, message: t("common.validation.required") }]}
                >
                    <Input placeholder={t("common.placeholder.name")} />
                </Form.Item>

                <Form.Item
                    name="username"
                    label={t("common.labels.username")}
                    rules={[{ required: true, message: t("common.validation.required") }]}
                >
                    <Input placeholder={t("common.placeholder.username")} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={
                        isEdit
                            ? t("common.labels.newPassword")
                            : t("common.labels.password")
                    }
                    rules={
                        isEdit
                            ? []
                            : [{ required: true, message: t("common.validation.required") }]
                    }
                >
                    <InputPassword
                        placeholder={
                            isEdit
                                ? t("common.placeholder.newPassword")
                                : t("common.placeholder.password")
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="confirm_password"
                    label={t("common.labels.confirmPassword")}
                    dependencies={["password"]}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !getFieldValue("password") ||
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(t("common.messages.passwordMismatch")),
                                );
                            },
                        }),
                    ]}
                >
                    <InputPassword
                        placeholder={t("common.placeholder.confirmPassword")}
                    />
                </Form.Item>

                <Form.Item
                    name="telegram_user_id"
                    label={t("common.labels.telegramUserId")}
                    initialValue={0}
                >
                    <Input placeholder={t("common.placeholder.telegramUserId")} />
                </Form.Item>

                <Form.Item
                    name="telegram_group_id"
                    label={t("common.labels.telegramGroupId")}
                >
                    <Input placeholder={t("common.placeholder.telegramGroupId")} />
                </Form.Item>

                <Form.Item
                    name="is_active"
                    label={t("common.labels.active")}
                    initialValue={1}
                >
                    <Select
                        placeholder={t("common.placeholder.selectStatus")}
                        options={[
                            { value: 1, label: t("common.labels.yes") },
                            { value: 0, label: t("common.labels.no") },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="is_admin"
                    label={t("common.labels.admin")}
                    initialValue={0}
                >
                    <Select
                        placeholder={t("common.placeholder.selectRole")}
                        options={[
                            { value: 1, label: t("common.labels.yes") },
                            { value: 0, label: t("common.labels.no") },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="is_factory"
                    label={t("common.labels.factory")}
                    initialValue={0}
                >
                    <Select
                        placeholder={t("common.placeholder.selectRole")}
                        options={[
                            { value: 1, label: t("common.labels.yes") },
                            { value: 0, label: t("common.labels.no") },
                        ]}
                    />
                </Form.Item>
            </div>
        </div>
    );
};

export default ProfileForm;
