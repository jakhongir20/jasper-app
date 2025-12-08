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
import {
  buildTransactionPayload,
  extractId,
  normalizeString,
  toNullableNumber,
  cleanTransactionForServiceManager,
} from "@/features/dashboard/bids/utils/transactionTransform";

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
      return;

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

  const { mutate: createApplication, isPending: isLoading } =
    useCreateApplication({
      onSuccess: async (response: any, variables: any) => {
        try {
          const createdId =
            response?.application_id ??
            response?.data?.application_id ??
            response?.id;

          if (!createdId) {
            toast(t("common.messages.error"), "error");
            return;
          }

          // Clean transaction data for service-manager (stricter validation)
          const cleanedVariables = {
            ...variables,
            application_transactions: variables.application_transactions?.map(
              cleanTransactionForServiceManager
            ) || [],
          };

          // Sequential execution: service-manager → forecast
          await BidsService.serviceManager(createdId, cleanedVariables);
          await BidsService.forecastServices(createdId);

          // All steps succeeded
          toast(t("toast.success"), "success");
          navigate(`/dashboard/bids/${createdId}?tab=2`);
        } catch (error) {
          // Error in service-manager or forecast
          console.error("Post-creation error:", error);
          toast(t("common.messages.error"), "error");
        }
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
        ({ _uid, ...transaction }: { _uid?: string;[key: string]: any; }) =>
          buildTransactionPayload(transaction),
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
        delivery_date: generalValues?.delivery_date
          ? getDateTime(generalValues.delivery_date)
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

      createApplication(payload as any);
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
