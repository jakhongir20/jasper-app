import { Form } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/helpers";
import { useCreateUser, CreateUserPayload } from "@/features/admin/users/model";
import { showGlobalToast } from "@/shared/hooks";
import { CAddHeader } from "@/shared/ui";
import { UserForm } from "./UserForm";

interface Props {
  className?: string;
}

export const UserAddForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isPending: isLoading } = useCreateUser({
    onSuccess: () => {
      navigate("/admin/users");
      showGlobalToast("User created successfully", "success");
    },
  });

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (values.password !== values.confirm_password) {
        showGlobalToast("Passwords do not match", "error");
        return;
      }

      const payload: CreateUserPayload = {
        name: values.name,
        username: values.username,
        password: values.password,
        is_active: Boolean(values.is_active),
        is_admin: Boolean(values.is_admin),
        is_factory: Boolean(values.is_factory),
        telegram_user_id: values.telegram_user_id || 0,
      };

      mutate(payload);
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className={cn(className)}
      scrollToFirstError
    >
      <CAddHeader
        mode="add"
        title={t("common.labels.user")}
        loading={isLoading}
        onSave={handleSave}
      />

      <UserForm />
    </Form>
  );
};

export default UserAddForm;
