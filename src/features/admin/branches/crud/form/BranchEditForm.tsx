import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateBranch, useBranch } from "@/features/admin/branches/model";
import { showGlobalToast } from "@/shared/hooks";
import { Input, Modal } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  branchId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BranchEditForm: FC<Props> = ({ open, branchId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: branch, isLoading: isLoadingBranch } = useBranch(branchId);

  const { mutate, isPending: isLoading } = useUpdateBranch({
    onSuccess: () => {
      showGlobalToast(t("common.messages.branchUpdated"), "success");
      queryClient.invalidateQueries({ queryKey: ["tableData"] });
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

  useEffect(() => {
    if (branch && open) {
      form.setFieldsValue({
        name: branch.name,
        branch_phone_number: branch.branch_phone_number,
      });
    }
  }, [branch, open, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate({
        branch_id: branchId,
        name: values.name,
        branch_phone_number: values.branch_phone_number,
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t("common.labels.editBranch")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSubmit}
      loading={isLoading || isLoadingBranch}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      size="middle"
      form={form}
    >
      <Form.Item
        name="name"
        label={t("common.labels.name")}
        rules={[{ required: true, message: t("common.validation.required") }]}
      >
        <Input placeholder={t("common.placeholder.branchName")} />
      </Form.Item>
      <br />
      <Form.Item
        name="branch_phone_number"
        label={t("common.labels.phone")}
      >
        <Input placeholder={t("common.placeholder.phone")} />
      </Form.Item>
    </Modal>
  );
};
