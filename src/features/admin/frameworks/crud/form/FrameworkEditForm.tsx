import { Form } from "antd";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/helpers";
import {
  useUpdateFramework,
  useFrameworkDetail,
  UpdateFrameworkPayload,
} from "@/features/admin/frameworks/model";
import { showGlobalToast } from "@/shared/hooks";
import { Modal } from "@/shared/ui";
import { FrameworkForm } from "./FrameworkForm";
import { useQueryClient } from "@tanstack/react-query";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  frameworkId: number;
  className?: string;
}

export const FrameworkEditForm: FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  frameworkId,
  className,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { getAssetUrl, baseUrl } = useStaticAssetsUrl();
  const queryClient = useQueryClient();

  const { data: framework, isPending: isLoadingDetail } =
    useFrameworkDetail(frameworkId);

  const { mutate, isPending: isLoading } = useUpdateFramework({
    onSuccess: () => {
      showGlobalToast(t("common.messages.frameworkUpdated"), "success");

      queryClient.invalidateQueries({ queryKey: ["tableData"] });
      queryClient.invalidateQueries({ queryKey: ["framework-detail", frameworkId] });

      onSuccess();
    },
    onError: (error: any) => {
      showGlobalToast(
        error?.message || t("common.messages.frameworkUpdateFailed"),
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
    if (open && !isLoadingDetail && framework) {
      // Handle both image_url and framework_image for backward compatibility
      const imageField = (framework as any).framework_image || framework.image_url;
      const fullImageUrl = imageField
        ? getAssetUrl(imageField)
        : null;

      const transformedData = {
        name: framework.name,
        image_url: fullImageUrl,
        order_number: framework.order_number,
        doorway_type: framework.doorway_type,
        is_frame: framework.is_frame,
        is_filler: framework.is_filler,
      };

      form.setFieldsValue(transformedData);
    }
  }, [open, framework, isLoadingDetail, form, getAssetUrl]);

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
        } else if (imageUrl.startsWith(baseUrl)) {
          // Extract relative path from full URL
          imageUrl = imageUrl.replace(`${baseUrl}/`, "");
        }
        // If it's already a relative path, use it as is
      }

      const payload: UpdateFrameworkPayload = {
        name: values.name,
        framework_image: imageUrl,
        order_number: values.order_number,
        doorway_type: values.doorway_type,
        is_frame: values.is_frame,
        is_filler: values.is_filler,
      };

      mutate({ frameworkId, payload });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  if (isLoadingDetail) {
    return (
      <Modal
        title={t("common.labels.editFramework")}
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

  if (!framework) {
    return (
      <Modal
        title={t("common.labels.editFramework")}
        open={open}
        onCancel={handleCancel}
        width={600}
      >
        <div className="flex h-32 items-center justify-center">
          <div className="text-lg text-red-500">
            {t("common.messages.frameworkNotFound")}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={t("common.labels.editFramework")}
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
        <FrameworkForm isEdit={true} />
      </Form>
    </Modal>
  );
};
