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
      const fullImageUrl = molding.image_url
        ? `${getStaticAssetsBaseUrl()}/${molding.image_url}`
        : null;

      const transformedData = {
        name: molding.name,
        molding_image: fullImageUrl,
        order: molding.order,
        has_up_trim: molding.has_up_trim,
        has_under_trim: molding.has_under_trim,
        has_crown: molding.has_crown,
        height_minus_coefficient: molding.height_minus_coefficient,
        width_minus_coefficient: molding.width_minus_coefficient,
        height_plus_coefficient: molding.height_plus_coefficient,
        width_plus_coefficient: molding.width_plus_coefficient,
        is_height_coefficient_applicable:
          molding.is_height_coefficient_applicable,
        height_coefficient_use_case: molding.height_coefficient_use_case,
        is_height_coefficient_double: molding.is_height_coefficient_double,
        is_width_coefficient_applicable:
          molding.is_width_coefficient_applicable,
        width_coefficient_use_case: molding.width_coefficient_use_case,
        is_width_coefficient_double: molding.is_width_coefficient_double,
      };

      form.setFieldsValue(transformedData);
    }
  }, [molding, isLoadingDetail, form, getStaticAssetsBaseUrl]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Extract relative path from full URL if it's a full URL
      let imageUrl = values.molding_image;
      if (imageUrl && imageUrl.startsWith(getStaticAssetsBaseUrl())) {
        imageUrl = imageUrl.replace(`${getStaticAssetsBaseUrl()}/`, "");
      }

      const payload: UpdateMoldingPayload = {
        molding_id: moldingId,
        name: values.name,
        molding_image: imageUrl,
        order: values.order || 0,
        has_up_trim: values.has_up_trim || false,
        has_under_trim: values.has_under_trim || false,
        has_crown: values.has_crown || false,
        height_minus_coefficient: values.height_minus_coefficient || 0,
        width_minus_coefficient: values.width_minus_coefficient || 0,
        height_plus_coefficient: values.height_plus_coefficient || 0,
        width_plus_coefficient: values.width_plus_coefficient || 0,
        is_height_coefficient_applicable:
          values.is_height_coefficient_applicable || false,
        height_coefficient_use_case:
          values.height_coefficient_use_case || false,
        is_height_coefficient_double:
          values.is_height_coefficient_double || false,
        is_width_coefficient_applicable:
          values.is_width_coefficient_applicable || false,
        width_coefficient_use_case: values.width_coefficient_use_case || false,
        is_width_coefficient_double:
          values.is_width_coefficient_double || false,
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
