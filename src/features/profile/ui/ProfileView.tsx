import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Descriptions, Space } from "antd";
import { cn } from "@/shared/helpers";
import { User } from "@/features/admin/users/model/model.types";
import { Status } from "@/shared/ui";

interface Props {
    user: User;
    onEdit: () => void;
    className?: string;
}

export const ProfileView: FC<Props> = ({ user, onEdit, className }) => {
    const { t } = useTranslation();

    return (
        <div className={cn("px-10", className)}>
            <div className="my-6  flex justify-between items-center">
                <h4 className="text-2xl font-semibold text-dark">
                    {t("common.labels.userDetails")}
                </h4>
                <Button type="primary" onClick={onEdit}>
                    {t("common.button.edit")}
                </Button>
            </div>

            <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label={t("common.labels.id")}>
                    {user.user_id}
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.name")}>
                    {user.name}
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.username")}>
                    {user.username}
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.active")}>
                    <Status value={user.is_active} />
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.admin")}>
                    <Status value={user.is_admin} />
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.factory")}>
                    <Status value={user.is_factory} />
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.telegramUserId")}>
                    {user.telegram_user_id || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.telegramGroupId")}>
                    {user.telegram_group_id || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("common.labels.createdAt")}>
                    {new Date(user.created_at * 1000).toLocaleDateString()}
                </Descriptions.Item>
            </Descriptions>
        </div >
    );
};

export default ProfileView;
