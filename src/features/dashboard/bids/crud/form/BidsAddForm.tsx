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
    fields: ["aspects"],
  },
  // {
  //   tabKey: "4",
  //   fields: ["sheathings"],
  // },
  {
    tabKey: "4",
    fields: ["baseboards"],
  },
  {
    tabKey: "5",
    fields: ["floors"],
  },
  {
    tabKey: "6",
    fields: ["windowsills"],
  },
  {
    tabKey: "7",
    fields: ["lattings"],
  },
  {
    tabKey: "8",
    fields: ["frameworks"],
  },
  {
    tabKey: "9",
    fields: ["decorations"],
  },
  {
    tabKey: "10",
    fields: ["services"],
  },
  {
    tabKey: "11",
    fields: ["qualities"],
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
      const apiData = {
        application_transactions: transactions.map((t: any) => ({
          product_id:
            typeof t.product_id === "object"
              ? t.product_id?.product_id || 0
              : t.product_id || 0,
          quantity: t.quantity || 0,
          sash: t.sash || "string",
          sheathing_id:
            typeof t.sheathing_id === "object"
              ? t.sheathing_id?.product_id || 0
              : t.sheathing_id || 0,
          canopy_id:
            typeof t.canopy_id === "object"
              ? t.canopy_id?.product_id || 0
              : t.canopy_id || 0,
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
        const existingServices = form.getFieldValue("services") || [];
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
        form.setFieldsValue({ services: updatedServices });
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
          } catch (err) {}
        }
      }

      // If it's not a validation error, show a generic error
      toast(t("common.messages.error"), "error");
    },
  });

  const handleSave = () => {
    form.validateFields().then(({ general }) => {
      const transactions = form.getFieldValue("transactions") || [];
      const aspects = form.getFieldValue("aspects") || [];
      // const sheathings = form.getFieldValue("sheathings") || [];
      const baseboards = form.getFieldValue("baseboards") || [];
      const floors = form.getFieldValue("floors") || [];
      const windowsills = form.getFieldValue("windowsills") || [];
      const lattings = form.getFieldValue("lattings") || [];
      const frameworks = form.getFieldValue("frameworks") || [];
      const decorations = form.getFieldValue("decorations") || [];
      const services = form.getFieldValue("services") || [];
      const qualities = form.getFieldValue("qualities") || [];

      const rawData = {
        address: general?.address,
        remark: general?.remark,
        sizes: general?.sizes,
        default_door_lock_id:
          general?.default_door_lock_id?.category?.section_index,
        default_hinge_id: general?.default_hinge_id?.category?.section_index,
        production_date: general?.production_date
          ? getDateTime(general?.production_date)
          : undefined,

        transactions:
          transactions?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              product_id: getValue("product_id", t?.product_id),
              lining_number: getValue("lining_id", t?.lining_number),
              frame_front_id: getValue("molding_id", t?.frame_front_id),
              frame_back_id: getValue("molding_id", t?.frame_back_id),
              sheathing_id: getValue("product_id", t?.sheathing_id),
              trim_id: getValue("product_id", t?.trim_id),
              up_trim_id: getValue("product_id", t?.up_trim_id),
              under_trim_id: getValue("product_id", t?.under_trim_id),
              filler_id: getValue("product_id", t?.filler_id),
              crown_id: getValue("product_id", t?.crown_id),
              glass_id: getValue("product_id", t?.glass_id),
              door_lock_id: getValue("product_id", t?.door_lock_id),
              canopy_id: getValue("product_id", t?.canopy_id),
              latch_id: getValue("product_id", t?.latch_id),
              box_service_id: getValue("product_id", t?.box_service_id),
              // Additional fields
              booklet_number: t?.booklet_number,
              factory_mdf_type: t?.factory_mdf_type,
              factory_height: t?.factory_height,
              factory_width: t?.factory_width,
              factory_mdf: t?.factory_mdf,
              factory_carcass: t?.factory_carcass,
              factory_rail: t?.factory_rail,
              catalogue_number: t?.catalogue_number,
              pattern_form: t?.pattern_form,
              quality_multiplier: t?.quality_multiplier,
              volume_product: t?.volume_product,
              sheathing_height: t?.sheathing_height,
              sheathing_width: t?.sheathing_width,
              sheathing_thickness: t?.sheathing_thickness,
              sheathing_quantity: t?.sheathing_quantity,
              trim_height: t?.trim_height,
              trim_width: t?.trim_width,
              trim_quantity: t?.trim_quantity,
              filler_height: t?.filler_height,
              filler_width: t?.filler_width,
              filler_quantity: t?.filler_quantity,
              crown_height: t?.crown_height,
              crown_width: t?.crown_width,
              box_service_quantity: t?.box_service_quantity,
              box_service_length: t?.box_service_length,
            }),
          ) || [],
        aspects:
          aspects?.map(
            ({ _uid, ...item }: { _uid?: string; [key: string]: unknown }) => ({
              ...item,
              aspect_file_name:
                item?.aspect_file_name ||
                item?.comment ||
                t("common.placeholder.aspect"),
            }),
          ) || [],
        sheathings: [],
        baseboards:
          baseboards?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              baseboard_id: getValue("baseboard_id", t?.baseboard_id),
            }),
          ) || [],
        floors:
          floors?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              floor_id: getValue("floor_id", t?.floor_id),
            }),
          ) || [],
        windowsills:
          windowsills?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              windowsill_id: getValue("windowsill_id", t?.windowsill_id),
            }),
          ) || [],
        lattings:
          lattings?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              latting_id: getValue("latting_id", t?.latting_id),
            }),
          ) || [],
        frameworks:
          frameworks?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              framework_id: getValue("framework_id", t?.framework_id),
            }),
          ) || [],
        decorations:
          decorations?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              decoration_id: getValue("decoration_id", t?.decoration_id),
            }),
          ) || [],
        services:
          services?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              service_id: getValue("service_id", t?.service_id),
            }),
          ) || [],
        qualities:
          qualities?.map(
            ({ _uid, ...t }: { _uid?: string; [key: string]: unknown }) => ({
              ...t,
              quality_id: getValue("quality_id", t?.quality_id),
            }),
          ) || [],
      };

      mutate(rawData);
    });
  };

  function getValue<T = unknown>(key: string, value: any): T {
    if (value && typeof value === "object" && key in value) {
      return value[key];
    }
    if (value === 0 || value === "0" || value === "") {
      return null as T;
    }
    return value;
  }

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
