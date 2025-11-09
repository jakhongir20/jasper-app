import { Form } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { type FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  ApplicationLocalForm,
  useCreateApplication,
} from "@/features/dashboard/bids/model";
import { cn } from "@/shared/helpers";
import { useTabErrorHandler, useToast } from "@/shared/hooks";
import { CAddHeader } from "@/shared/ui";
import { BidsTab } from "@/features/dashboard/bids/crud";
import {
  formatValidationErrorsForDisplay,
  getDateTime,
  getRandomId,
} from "@/shared/utils";
import { BidsService } from "@/features/dashboard/bids/model/bids.service";

interface Props {
  className?: string;
}

const tabConfigs = [
  {
    tabKey: "1",
    fields: ["general"],
  },
  {
    tabKey: "2",
    fields: ["transactions"],
  },
  {
    tabKey: "3",
    fields: ["application_aspects"],
  },
  {
    tabKey: "11",
    fields: ["application_services"],
  },
  {
    tabKey: "12",
    fields: ["application_qualities"],
  },
];

const toNullableNumber = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const normalizeString = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  const stringValue = String(value);
  return stringValue.length === 0 ? null : stringValue;
};

const extractId = (
  value: any,
  keys: string[] = [
    "product_id",
    "category_section_index",
    "category_id",
    "customer_id",
    "service_id",
    "quality_id",
    "value",
    "id",
  ],
): number | null => {
  if (value && typeof value === "object") {
    for (const key of keys) {
      if (value[key] !== undefined && value[key] !== null) {
        const candidate = value[key];
        const numeric = Number(candidate);
        if (!Number.isNaN(numeric)) {
          return numeric;
        }
      }
    }
  }

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

// Default form values for testing - will be defined inside component

export const BidsAddForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm<ApplicationLocalForm>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { formFinishFailed } = useTabErrorHandler(tabConfigs);

  const navigate = useNavigate();

  const [formFinishErrors] = useState<ValidateErrorEntity["errorFields"]>([]);

  // Calculate services based on form data
  const calculateServices = useCallback(async () => {
    try {
      const transactions = form.getFieldValue("transactions") || [];
      const baseboards = form.getFieldValue("baseboards") || [];
      const windowsills = form.getFieldValue("windowsills") || [];

      // Only proceed if we have data
      if (
        transactions.length === 0 &&
        baseboards.length === 0 &&
        windowsills.length === 0
      ) {
        return;
      }

      // Transform data to API format
      const apiData = {
        application_transactions: transactions.map((t: any) => ({
          product_id: extractId(t?.door_product_id) ?? 0,
          quantity: toNullableNumber(t?.entity_quantity) ?? 0,
          sash: toNullableNumber(t?.sash) ?? 0,
          sheathing_id: extractId(t?.sheathing_product_id) ?? 0,
          canopy_id: extractId(t?.hinge_product_id) ?? 0,
        })),
        application_baseboards: baseboards.map((b: any) => ({
          baseboard_id:
            typeof b.baseboard_id === "object"
              ? b.baseboard_id?.baseboard_id || 0
              : b.baseboard_id || 0,
          length: b.length || 0,
        })),
        application_windowsill: windowsills.map((w: any) => ({
          windowsill_id:
            typeof w.windowsill_id === "object"
              ? w.windowsill_id?.windowsill_id || 0
              : w.windowsill_id || 0,
          quantity: w.quantity || 0,
        })),
      };

      // Call the service manager API
      const response = await BidsService.getServiceManager(apiData);

      if (response?.results?.services) {
        // Get existing services and separate user vs API services
        const existingServices =
          form.getFieldValue("application_services") || [];
        const userServices = existingServices.filter(
          (s: any) => s.source !== "api",
        );

        // Create new API services with source field
        const apiServices = response.results.services.map((service: any) => ({
          ...service,
          _uid: getRandomId("service_"),
          service_id: service.service_id,
          quantity: service.quantity || 0,
          source: "api", // Mark as API generated
        }));

        // Merge: keep user services + replace API services
        const updatedServices = [...userServices, ...apiServices];
        form.setFieldsValue({ application_services: updatedServices });
      }
    } catch (error) {
      // Silently fail as per requirements
    }
  }, [form]);

  // Debug: Check form values periodically (only when there are changes)
  useEffect(() => {
    let lastTransactions: any[] = [];
    let lastBaseboards: any[] = [];
    let lastWindowsills: any[] = [];

    const interval = setInterval(() => {
      const transactions = form.getFieldValue("transactions") || [];
      const baseboards = form.getFieldValue("baseboards") || [];
      const windowsills = form.getFieldValue("windowsills") || [];

      // Only log if values actually changed
      const transactionsChanged =
        JSON.stringify(transactions) !== JSON.stringify(lastTransactions);
      const baseboardsChanged =
        JSON.stringify(baseboards) !== JSON.stringify(lastBaseboards);
      const windowsillsChanged =
        JSON.stringify(windowsills) !== JSON.stringify(lastWindowsills);

      if (transactionsChanged || baseboardsChanged || windowsillsChanged) {
        if (transactionsChanged) {
          lastTransactions = transactions;
        }
        if (baseboardsChanged) {
          lastBaseboards = baseboards;
        }
        if (windowsillsChanged) {
          lastWindowsills = windowsills;
        }

        // Calculate services when these fields change
        calculateServices();
      }
    }, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, [form, calculateServices]);

  const { mutate, isPending: isLoading } = useCreateApplication({
    onSuccess: () => {
      navigate(`/dashboard/bids`);

      toast(t("toast.success"), "success");
    },
    onError: (error) => {
      // Store the error for validation error handling
      // setValidationError(error); // This line is removed

      // Manually process validation errors if it's a 422
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as any).response;
        const statusCode = response?.status;
        const details = response?.data?.detail;

        if (statusCode === 422 && details && Array.isArray(details)) {
          try {
            const formattedErrors = formatValidationErrorsForDisplay(error);

            if (formattedErrors.length > 0) {
              formattedErrors.forEach((errorMsg: string) => {
                toast(errorMsg, "error");
              });
              return; // Don't show generic error
            }
          } catch (err) { }
        }
      }

      // If it's not a validation error, show a generic error
      toast(t("common.messages.error"), "error");
    },
  });

  const handleSave = () => {
    form.validateFields().then(({ general }) => {
      const generalValues = (general ?? {}) as Record<string, any>;
      const transactions = form.getFieldValue("transactions") || [];
      const applicationServices =
        form.getFieldValue("application_services") || [];
      const applicationQualities =
        form.getFieldValue("application_qualities") || [];
      const applicationAspects =
        form.getFieldValue("application_aspects") || [];

      const applicationTransactions = transactions.map(
        ({ _uid, ...transaction }: { _uid?: string;[key: string]: any; }) => ({
          location: normalizeString(transaction.location),
          product_type: transaction.product_type ?? null,
          opening_height: toNullableNumber(transaction.opening_height),
          opening_width: toNullableNumber(transaction.opening_width),
          opening_thickness: toNullableNumber(transaction.opening_thickness),
          entity_quantity: toNullableNumber(transaction.entity_quantity),
          framework_front_id: extractId(transaction.framework_front_id),
          framework_back_id: extractId(transaction.framework_back_id),
          threshold: normalizeString(transaction.threshold),
          opening_logic: normalizeString(transaction.opening_logic),
          sash: toNullableNumber(transaction.sash),
          chamfer: toNullableNumber(transaction.chamfer),
          transom_type: toNullableNumber(transaction.transom_type),
          transom_product_id: extractId(transaction.transom_product_id),
          transom_height_front: toNullableNumber(
            transaction.transom_height_front,
          ),
          transom_height_back: toNullableNumber(
            transaction.transom_height_back,
          ),
          door_product_id: extractId(transaction.door_product_id),
          sheathing_product_id: extractId(transaction.sheathing_product_id),
          frame_product_id: extractId(transaction.frame_product_id),
          filler_product_id: extractId(transaction.filler_product_id),
          crown_product_id: extractId(transaction.crown_product_id),
          up_frame_quantity: toNullableNumber(transaction.up_frame_quantity),
          up_frame_product_id: extractId(transaction.up_frame_product_id),
          under_frame_quantity: toNullableNumber(
            transaction.under_frame_quantity,
          ),
          under_frame_height: toNullableNumber(transaction.under_frame_height),
          under_frame_product_id: extractId(transaction.under_frame_product_id),
          percent_trim: toNullableNumber(transaction.percent_trim),
          trim_product_id: extractId(transaction.trim_product_id),
          percent_molding: toNullableNumber(transaction.percent_molding),
          molding_product_id: extractId(transaction.molding_product_id),
          percent_covering_primary: toNullableNumber(
            transaction.percent_covering_primary,
          ),
          covering_primary_product_id: extractId(
            transaction.covering_primary_product_id,
          ),
          percent_covering_secondary: toNullableNumber(
            transaction.percent_covering_secondary,
          ),
          covering_secondary_product_id: extractId(
            transaction.covering_secondary_product_id,
          ),
          percent_color: toNullableNumber(transaction.percent_color),
          color_product_id: extractId(transaction.color_product_id),
          color_custom_name: normalizeString(transaction.color_custom_name),
          floor_skirting_length: toNullableNumber(
            transaction.floor_skirting_length,
          ),
          floor_skirting_product_id: extractId(
            transaction.floor_skirting_product_id,
          ),
          heated_floor_product_id: extractId(
            transaction.heated_floor_product_id,
          ),
          windowsill_product_id: extractId(transaction.windowsill_product_id),
          latting_product_id: extractId(transaction.latting_product_id),
          window_product_id: extractId(transaction.window_product_id),
          glass_product_id: extractId(transaction.glass_product_id),
          volume_glass: toNullableNumber(transaction.volume_glass),
          door_lock_mechanism: normalizeString(transaction.door_lock_mechanism),
          door_lock_product_id: extractId(transaction.door_lock_product_id),
          hinge_mechanism: normalizeString(transaction.hinge_mechanism),
          hinge_product_id: extractId(transaction.hinge_product_id),
          door_bolt_product_id: extractId(transaction.door_bolt_product_id),
          door_stopper_quantity: toNullableNumber(
            transaction.door_stopper_quantity,
          ),
          door_stopper_product_id: extractId(
            transaction.door_stopper_product_id,
          ),
          anti_threshold_quantity: toNullableNumber(
            transaction.anti_threshold_quantity,
          ),
          anti_threshold_product_id: extractId(
            transaction.anti_threshold_product_id,
          ),
          box_width: toNullableNumber(transaction.box_width),
          percent_extra_option: toNullableNumber(
            transaction.percent_extra_option,
          ),
          extra_option_product_id: extractId(
            transaction.extra_option_product_id,
          ),
        }),
      );

      const applicationServicesPayload = applicationServices.map(
        ({ _uid, source, ...service }: any) => ({
          quantity: toNullableNumber(service.quantity),
          service_id: extractId(service.service_id),
        }),
      );

      const applicationQualitiesPayload = applicationQualities.map(
        ({ _uid, ...quality }: any) => ({
          quality_id: extractId(quality.quality_id),
        }),
      );

      const applicationAspectsPayload = applicationAspects.map(
        ({ _uid, ...aspect }: any) => ({
          comment: aspect.comment ?? "",
          aspect_file_payload: aspect.aspect_file_payload ?? "",
        }),
      );

      const payload = {
        application_date: generalValues?.application_date
          ? getDateTime(generalValues.application_date)
          : null,
        address: normalizeString(generalValues?.address),
        remark: normalizeString(generalValues?.remark),
        sizes: normalizeString(generalValues?.sizes),
        default_door_lock_id: extractId(generalValues?.default_door_lock_id),
        default_hinge_id: extractId(generalValues?.default_hinge_id),
        customer_id: extractId(generalValues?.customer_id, ["customer_id"]),
        application_transactions: applicationTransactions,
        application_services: applicationServicesPayload,
        application_qualities: applicationQualitiesPayload,
        application_aspects: applicationAspectsPayload,
      };

      mutate(payload as any);
    });
  };

  const handleFormValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      console.log("changedValues: ", allValues);
      if (
        changedValues.transactions ||
        changedValues.baseboards ||
        changedValues.windowsills
      ) {
        calculateServices();
      }
    },
    [calculateServices],
  );

  return (
    <Form
      form={form}
      layout="vertical"
      className={cn(className)}
      onFinishFailed={formFinishFailed}
      onValuesChange={handleFormValuesChange}
      scrollToFirstError
    >
      <CAddHeader
        mode="add"
        title={t("bids.add.title")}
        loading={isLoading}
        onSave={handleSave}
      />

      <BidsTab mode="add" formFinishErrors={formFinishErrors} />
    </Form>
  );
};
