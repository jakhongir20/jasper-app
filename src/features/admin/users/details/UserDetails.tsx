import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Descriptions, Space } from "antd";
import { cn } from "@/shared/helpers";
import { User } from "@/features/admin/users/model";
import { Status } from "@/shared/ui";

interface Props {
  user: User;
  className?: string;
}

export const UserDetails: FC<Props> = ({ user, className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/users/edit/${user.user_id}`);
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  return (
    <div className={cn("px-10", className)}>
      <div className="my-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-gray-900">
          {t("common.labels.userDetails")}
        </h4>
        <Space>
          <Button onClick={handleBack}>{t("common.button.back")}</Button>
          <Button type="primary" onClick={handleEdit}>
            {t("common.button.edit")}
          </Button>
        </Space>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <Descriptions
          title={t("common.labels.userInformation")}
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
            <Status value={user.is_active ? 1 : 0} />
          </Descriptions.Item>
          <Descriptions.Item label={t("common.labels.admin")}>
            <Status value={user.is_admin ? 1 : 0} />
          </Descriptions.Item>
          <Descriptions.Item label={t("common.labels.factory")}>
            <Status value={user.is_factory ? 1 : 0} />
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
      </div>
    </div>
  );
};

export default UserDetails;
