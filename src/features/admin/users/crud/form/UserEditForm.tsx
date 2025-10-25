import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/shared/helpers";
import { useUpdateUser, useUserDetail, UpdateUserPayload } from "@/features/admin/users/model";
import { showGlobalToast } from "@/shared/hooks";
import { CAddHeader } from "@/shared/ui";
import { UserForm } from "./UserForm";

interface Props {
  className?: string;
}

export const UserEditForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { guid } = useParams<{ guid: string }>();

  const userId = parseInt(guid || "0");
  const { data: user, isPending: isLoadingDetail } = useUserDetail(userId);

  const { mutate, isPending: isLoading } = useUpdateUser({
    onSuccess: () => {
      navigate("/admin/users");
      showGlobalToast("User updated successfully", "success");
    },
  });

  // Set form values when detail data is loaded
  useEffect(() => {
    if (!isLoadingDetail && user) {
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
  }, [user, isLoadingDetail, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (values.password && values.password !== values.confirm_password) {
        showGlobalToast("Passwords do not match", "error");
        return;
      }

      const payload: UpdateUserPayload = {
        user_id: userId,
        name: values.name,
        username: values.username,
        is_active: Boolean(values.is_active),
        is_admin: Boolean(values.is_admin),
        is_factory: Boolean(values.is_factory),
        telegram_user_id: values.telegram_user_id || 0,
      };

      // Only include password if it's provided
      if (values.password) {
        payload.password = values.password;
      }

      mutate({ userId, payload });
    });
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (isLoadingDetail) {
    return (
      <div className="px-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      className={cn(className)}
      scrollToFirstError
    >
      <CAddHeader
        code={user.username}
        mode="edit"
        title={t("common.labels.editUser")}
        loading={isLoading}
        addText={t("common.button.save")}
        onSave={handleSave}
        showCancelButton={true}
        onCancel={handleCancel}
      />

      <UserForm isEdit={true} />
    </Form>
  );
};

export default UserEditForm;
