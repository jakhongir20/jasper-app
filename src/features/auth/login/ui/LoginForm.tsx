import { Form } from "antd";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { LoginFormData } from "@/features/auth/login/model";
import { useLogin } from "@/features/auth/login/model/useLogin";
import { cn } from "@/shared/helpers";
import { deleteCookie, setCookie } from "@/shared/lib/services";
import { Button, Input, InputPassword } from "@/shared/ui";
import { useToast } from "@/shared/hooks";
import { useNavigate } from "react-router-dom";

interface Props {
  className?: string;
}

export const LoginForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm<LoginFormData>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useLogin({
    onSuccess: (response) => {
      const { user_id } = response?.user;

      const cookieOptions = { maxAge: 24 * 60 * 60 }; // 1 day

      setCookie("__token", response?.token, cookieOptions);
      setCookie("user_id", String(user_id), cookieOptions);

      // Store token in localStorage for persistent login
      localStorage.setItem("__token", response?.token);
      localStorage.setItem("__user", JSON.stringify(response));

      // Clear profile cache to ensure fresh data is fetched
      queryClient.removeQueries({ queryKey: ["profile"] });

      // const permissions = role?.access_data;
      //
      if (user_id) {
        toast(t("toast.loginSuccess"), "success");
        navigate("/", { replace: true });
        // setTimeout(() => window.location.replace("/home"), 500);
      }
    },
  });

  const handleSubmit = (values: LoginFormData) => {
    // Clear both cookies and localStorage before login
    deleteCookie("user_id");
    localStorage.removeItem("user_id");

    const { username, password } = values;
    mutate({ username, password });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        remember: false,
        username: "admin",
        password: "admin",
      }}
      className={cn(className, "flex flex-col gap-4 p-4 pt-5")}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label={t("auth.login.username")}
        rules={[{ required: true, whitespace: true }]}
      >
        <Input placeholder={t("auth.login.placeholder.username")} />
      </Form.Item>
      <Form.Item
        name="password"
        label={t("auth.login.password")}
        rules={[{ required: true, whitespace: true }]}
      >
        <InputPassword placeholder={t("auth.login.placeholder.password")} />
      </Form.Item>
      <p className="mt-4 text-center text-xs">
        <Trans
          i18nKey="auth.login.form.rememberMeInfo"
          components={{
            a: (
              <a
                href="#"
                target="_blank"
                className="text-primary hover:text-primary-hover"
              />
            ),
          }}
        />
      </p>
      <Form.Item className="mt-2">
        <Button
          type="primary"
          className="!w-full"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {!isLoading && t("common.button.login")}
        </Button>
      </Form.Item>
    </Form>
  );
};
