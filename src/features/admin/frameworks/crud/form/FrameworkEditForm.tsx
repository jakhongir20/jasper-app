import { Form } from "antd";
import { type FC, useEffect, useRef } from "react";
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
  const initialImageUrl = useRef<string | null>(null);

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
      console.error("Update framework error:", error?.response?.data || error);
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

      // Store initial image URL for comparison during save
      initialImageUrl.current = fullImageUrl;

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
      // Check if image was changed
      const currentImageUrl = values.image_url;
      const imageChanged = currentImageUrl !== initialImageUrl.current;

      // Valid doorway types according to API enum: 1 or 2
      const validDoorwayTypes = [1, 2];
      const doorway_type = validDoorwayTypes.includes(values.doorway_type)
        ? values.doorway_type
        : null;

      const payload: UpdateFrameworkPayload = {
        name: values.name,
        order_number: values.order_number,
        doorway_type,
        is_frame: values.is_frame,
        is_filler: values.is_filler,
      };

      // Only include framework_image in payload if it was changed
      if (imageChanged) {
        let imageUrl = currentImageUrl;
        if (imageUrl) {
          // Check if it's a base64 data URL (new upload)
          if (imageUrl.startsWith("data:image/")) {
            // Keep base64 as is - it will be handled by the backend
          } else {
            // Remove cache-busting parameters (e.g., ?t=123456)
            imageUrl = imageUrl.split("?")[0];

            if (imageUrl.startsWith(baseUrl)) {
              // Extract relative path from full URL
              imageUrl = imageUrl.replace(`${baseUrl}/`, "");
            }
          }
        }
        payload.framework_image = imageUrl;
      }

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
