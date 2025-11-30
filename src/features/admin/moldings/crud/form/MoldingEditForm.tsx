import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import {
  useUpdateMolding,
  useMoldingDetail,
  UpdateMoldingPayload,
} from "@/features/admin/moldings/model";
import { showGlobalToast } from "@/shared/hooks";
import { Modal } from "@/shared/ui";
import { useConfiguration } from "@/shared/contexts/ConfigurationContext";
import { MoldingForm } from "./MoldingForm";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  moldingId: number;
  className?: string;
}

export const MoldingEditForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  moldingId,
  className,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { getStaticAssetsBaseUrl } = useConfiguration();
  const queryClient = useQueryClient();

  const { data: molding, isPending: isLoadingDetail } =
    useMoldingDetail(moldingId);

  const { mutate, isPending: isLoading } = useUpdateMolding({
    onSuccess: () => {
      showGlobalToast(t("common.messages.moldingUpdated"), "success");

      queryClient.invalidateQueries({ queryKey: ["tableData"] });

      onSuccess();
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.message || t("common.messages.moldingUpdateFailed"),
        "error",
      );
    },
  });

  // Set form values when detail data is loaded
  useEffect(() => {
    if (!isLoadingDetail && molding) {
      const fullImageUrl = molding.framework_image
        ? `${getStaticAssetsBaseUrl()}/${molding.framework_image}`
        : null;

      const transformedData = {
        name: molding.name,
        framework_image: fullImageUrl,
        order_number: molding.order_number,
        doorway_type: molding.doorway_type,
        is_frame: molding.is_frame,
        is_filler: molding.is_filler,
      };

      form.setFieldsValue(transformedData);
    }
  }, [molding, isLoadingDetail, form, getStaticAssetsBaseUrl]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Extract relative path from full URL if it's a full URL
      let imageUrl = values.framework_image;
      if (imageUrl && imageUrl.startsWith(getStaticAssetsBaseUrl())) {
        imageUrl = imageUrl.replace(`${getStaticAssetsBaseUrl()}/`, "");
      }

      const payload: UpdateMoldingPayload = {
        name: values.name,
        framework_image: imageUrl,
        order_number: values.order_number,
        doorway_type: values.doorway_type,
        is_frame: values.is_frame,
        is_filler: values.is_filler,
      };

      mutate({ moldingId, payload });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  if (isLoadingDetail) {
    return (
      <Modal
        title={t("common.labels.editMolding")}
        open={open}
        onCancel={handleCancel}
        width={600}
      >
        <div className="flex h-32 items-center justify-center">
          <div className="text-lg">{t("common.messages.loading")}</div>
        </div>
      </Modal>
    );
  }

  if (!molding) {
    return (
      <Modal
        title={t("common.labels.editMolding")}
        open={open}
        onCancel={handleCancel}
        width={600}
      >
        <div className="flex h-32 items-center justify-center">
          <div className="text-lg text-red-500">
            {t("common.messages.moldingNotFound")}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={t("common.labels.editMolding")}
      open={open}
      onCancel={handleCancel}
      onSave={handleSave}
      saveBtnText={t("common.button.save")}
      cancelText={t("common.button.cancel")}
      loading={isLoading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className={cn(className)}
        scrollToFirstError
      >
        <MoldingForm isEdit={true} />
      </Form>
    </Modal>
  );
};
