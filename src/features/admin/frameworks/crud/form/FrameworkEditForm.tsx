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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  // Set form values when detail data is loaded
  useEffect(() => {
    if (open && !isLoadingDetail && molding) {
      const fullImageUrl = molding.image_url
        ? `${getStaticAssetsBaseUrl()}/${molding.image_url}`
        : null;

      const transformedData = {
        name: molding.name,
        image_url: fullImageUrl,
        order_number: molding.order_number,
        doorway_type: molding.doorway_type,
        is_frame: molding.is_frame,
        is_filler: molding.is_filler,
      };

      form.setFieldsValue(transformedData);
    }
  }, [open, molding, isLoadingDetail, form, getStaticAssetsBaseUrl]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Extract relative path from full URL if it's a full URL
      // If it's a base64 string (new upload), use it as is
      // If it's a full URL (existing image), extract the relative path
      let imageUrl = values.image_url;
      if (imageUrl) {
        // Check if it's a base64 data URL (new upload)
        if (imageUrl.startsWith("data:image/")) {
          // Keep base64 as is - it will be handled by the backend
          imageUrl = imageUrl;
        } else if (imageUrl.startsWith(getStaticAssetsBaseUrl())) {
          // Extract relative path from full URL
          imageUrl = imageUrl.replace(`${getStaticAssetsBaseUrl()}/`, "");
        }
        // If it's already a relative path, use it as is
      }

      const payload: UpdateMoldingPayload = {
        name: values.name,
        image_url: imageUrl,
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
