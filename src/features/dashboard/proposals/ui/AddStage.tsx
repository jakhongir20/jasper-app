import { useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCargoStage } from "@/features/purchase/no-ship/model/no-shipment.mutations";
import { useToast } from "@/shared/hooks";
import { Input, Modal } from "@/shared/ui";

interface Props {
  open: boolean;
  closeModal: () => void;
}

export const CreateCargoStageAction: FC<Props> = ({ open, closeModal }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useCreateCargoStage({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["logistic-stage"],
      });

      toast(t("common.toast.successDelete"), "success");
      form.resetFields();
      closeModal();
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      mutate(values.title);
    });
  };

  return (
    <Modal
      title={t("common.actions.addStage")}
      open={open}
      size={"small"}
      cancelText={t("common.button.undo")}
      saveBtnText={t("common.button.add")}
      footerBordered
      onCancel={closeModal}
      onSave={handleSubmit}
      loading={isLoading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          rules={[{ required: true, whitespace: true }]}
          label={t("common.input.stage")}
        >
          <Input placeholder={t("common.input.placeholder.addStageName")} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
