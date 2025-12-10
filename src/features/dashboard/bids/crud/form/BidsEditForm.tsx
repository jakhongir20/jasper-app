import { Form } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { type FC, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  ApplicationLocalForm,
  ApplicationService,
  ApplicationAdditionalQuality,
  Option,
  TransactionFormType,
  useUpdateApplication,
} from "@/features/dashboard/bids/model";
import { useApplicationDetail } from "@/features/dashboard/bids/model/bids.queries";
import { cn } from "@/shared/helpers";
import { getRandomId } from "@/shared/utils";
import { useTabErrorHandler, useToast } from "@/shared/hooks";
import { CAddHeader } from "@/shared/ui";
import { BidsTab } from "@/features/dashboard/bids/crud";
import { getDateTime } from "@/shared/utils";
import { useStaticAssetsUrl } from "@/shared/hooks/useStaticAssetsUrl";
import { ApiService } from "@/shared/lib/services";
import { BidsService } from "@/features/dashboard/bids/model/bids.service";
import {
  buildTransactionPayload,
  transformTransactionDetailToForm,
  extractId,
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
    fields: ["aspects"],
  },
  {
    tabKey: "4",
    fields: ["sheathings"],
  },
  {
    tabKey: "5",
    fields: ["baseboards"],
  },
  {
    tabKey: "6",
    fields: ["floors"],
  },
  {
    tabKey: "7",
    fields: ["windowsills"],
  },
  {
    tabKey: "8",
    fields: ["lattings"],
  },
  {
    tabKey: "9",
    fields: ["frameworks"],
  },
  {
    tabKey: "10",
    fields: ["decorations"],
  },
  {
    tabKey: "11",
    fields: ["services"],
  },
  {
    tabKey: "12",
    fields: ["qualities"],
  },
];

export const BidsEditForm: FC<Props> = ({ className }) => {
  const [form] = Form.useForm<ApplicationLocalForm>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { formFinishFailed } = useTabErrorHandler(tabConfigs);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const { getAssetUrl } = useStaticAssetsUrl();

  const [formFinishErrors] = useState<ValidateErrorEntity["errorFields"]>([]);

  const { data: applicationDetail, isPending: isLoadingDetail } =
    useApplicationDetail(id as string);

  const { mutate, isPending: isLoading } = useUpdateApplication({
    onSuccess: async (_, variables: { id: string; formData: any }) => {
      try {
        // Clean transaction data for service-manager (stricter validation)
        const cleanedFormData = {
          ...variables.formData,
          application_transactions: variables.formData.application_transactions?.map(
            cleanTransactionForServiceManager
          ) || [],
          transactions: variables.formData.transactions?.map(
            cleanTransactionForServiceManager
          ) || [],
        };

        // Sequential execution: service-manager → forecast
        await BidsService.serviceManager(variables.id, cleanedFormData);
        await BidsService.forecastServices(variables.id);

        // All steps succeeded
        toast(t("toast.successUpdate"), "success");
      } catch (error) {
        // Error in service-manager or forecast - still show success since application was updated
        console.error("Post-update error:", error);
        toast(t("toast.successUpdate"), "success");
      }

      // Always navigate to the updated application, regardless of post-update errors
      navigate(`/dashboard/bids/${variables.id}?tab=2`);
    },
  });

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

        // Don't auto-calculate services when editing
        // calculateServices();
      }
    }, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, [form]);

  // Set form values when detail data is loaded
  useEffect(() => {
    if (!isLoadingDetail && applicationDetail) {
      const applicationTransactions = (
        ((applicationDetail as any).application_transactions ??
          applicationDetail.transactions ??
          []) as Array<Record<string, any>>
      ).map((transaction) => {
        const normalized = transformTransactionDetailToForm(transaction);
        const merged = {
          ...transaction,
          ...normalized,
        };

        const basicVolume = calculateVolume(
          merged.height || merged.opening_height || 0,
          merged.width || merged.opening_width || 0,
          merged.quantity || merged.entity_quantity || 0,
        );

        return {
          _uid: getRandomId("transaction_"),
          id:
            transaction.application_transaction_id ?? transaction.id ?? 0,
          ...merged,
          volume_product: merged.volume_product ?? basicVolume,
        } as TransactionFormType;
      });

      const applicationAspects =
        ((applicationDetail as any).application_aspects ??
          applicationDetail.aspects ??
          [])?.map((aspect: any) => {
            const payload =
              aspect.aspect_file_payload ??
              (aspect.aspect_file_url
                ? getAssetUrl(aspect.aspect_file_url)
                : aspect.aspect ?? "");

            return {
              _uid: getRandomId("aspect_"),
              id: aspect.application_aspect_id ?? aspect.id ?? 0,
              comment: aspect.comment ?? "",
              aspect_file_payload: payload ?? "",
            };
          }) ?? [];

      const applicationServices =
        ((applicationDetail as any).application_services ??
          applicationDetail.services ??
          [])?.map((service: any) => {
            const serviceId =
              service.service_id ??
              service?.service?.service_id ??
              service?.service?.id ??
              null;

            return {
              _uid: getRandomId("service_"),
              id: service.application_service_id ?? service.id ?? 0,
              service_id: serviceId,
              service: service.service ?? undefined,
              name: service?.service?.name ?? service.name ?? "",
              quantity: service.quantity ?? 0,
              source: service.source ?? "api",
            } as ApplicationService & { source?: string; };
          }) ?? [];

      const applicationQualities =
        ((applicationDetail as any).application_qualities ??
          applicationDetail.qualities ??
          [])?.map((quality: any) => {
            const qualityId =
              quality.quality_id ??
              quality?.quality?.quality_id ??
              quality?.quality?.id ??
              null;

            return {
              _uid: getRandomId("quality_"),
              id: quality.application_quality_id ?? quality.id ?? 0,
              quality_id: qualityId,
              quality: quality.quality ?? undefined,
            } as ApplicationAdditionalQuality;
          }) ?? [];

      const applicationDate = (applicationDetail as any)?.application_date;
      const deliveryDate = (applicationDetail as any)?.delivery_date;

      const customerFromDetail = (applicationDetail as any)?.customer;
      const customerIdValue =
        customerFromDetail?.customer_id ??
        (applicationDetail as any)?.customer_id ??
        undefined;

      // Build customer select value - use customer_name/customer_phone even without customer_id
      const customerName = customerFromDetail?.name ?? applicationDetail.customer_name ?? "";
      const customerPhone = customerFromDetail?.phone_number ?? applicationDetail.customer_phone ?? "";

      // Create customerSelectValue if we have either customer_id OR customer_name
      const customerSelectValue = (customerIdValue || customerName)
        ? {
          customer_id: customerIdValue ?? 0, // Use 0 as placeholder if no ID available
          name: customerName,
          phone_number: customerPhone,
          is_active: customerFromDetail?.is_active ?? true,
        }
        : undefined;

      const transformedData: ApplicationLocalForm = {
        general: {
          number: applicationDetail.number || "",
          address: applicationDetail.address || "",
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_id: customerSelectValue,
          phone_number: customerPhone,
          remark: applicationDetail.remark || "",
          sizes: (applicationDetail.sizes as string) || "",
          color: applicationDetail.color
            ? { name: applicationDetail.color }
            : undefined,
          application_date: applicationDate
            ? dayjs(applicationDate)
            : applicationDetail.date
              ? dayjs(applicationDetail.date)
              : undefined,
          delivery_date: deliveryDate
            ? dayjs(deliveryDate)
            : undefined,
          category_name: applicationDetail.category_name || "",
          date: applicationDetail.date
            ? dayjs(applicationDetail.date)
            : undefined,
          datetime: applicationDetail.date
            ? dayjs(applicationDetail.date)
            : undefined,
          production_date: applicationDetail.production_date
            ? dayjs(applicationDetail.production_date)
            : undefined,
          status: applicationDetail.status || 1,
          door_lock:
            (applicationDetail.door_lock as any)?.product_id?.toString() || "",
          canopy:
            (applicationDetail.canopy as any)?.product_id?.toString() || "",
          default_hinge_id: (applicationDetail as any)?.default_hinge_id || undefined,
          default_door_lock_id: (applicationDetail as any)?.default_door_lock_id || undefined,
          box_width: (applicationDetail as any)?.box_width || undefined,
          transom_height_front: applicationDetail.transom_height_front || 0,
          transom_height_back: applicationDetail.transom_height_back || 0,
        } as any,
        transactions: applicationTransactions || [],
        application_aspects: applicationAspects,
        aspects: applicationAspects,
        sheathings:
          applicationDetail.sheathings?.map((sheathing: any) => {
            // Calculate volume for sheathing
            const volume = calculateVolume(
              sheathing.height || 0,
              sheathing.width || 0,
              sheathing.quantity || 0,
            );

            return {
              _uid: getRandomId("sheathing_"),
              id: sheathing.application_sheathing_id || 0,
              sheathing_id: sheathing.sheathing_id || null,
              sheathing: sheathing.sheathing, // Include the full object
              height: sheathing.height || 0,
              width: sheathing.width || 0,
              quantity: sheathing.quantity || 0,
              volume: sheathing.volume || volume,
            };
          }) || [],
        baseboards:
          applicationDetail.baseboards?.map((baseboard) => {
            // Calculate total length for baseboard
            const totalLength = calculateLength(
              baseboard.length || 0,
              baseboard.quantity || 0,
            );

            return {
              _uid: getRandomId("baseboard_"),
              id: baseboard.application_baseboard_id || 0,
              baseboard_id: baseboard.baseboard_id || undefined,
              baseboard: baseboard.baseboard, // Include the full object
              length: baseboard.length || 0,
              quantity: baseboard.quantity || 0,
              style: baseboard.style || "",
              volume: totalLength,
            };
          }) || [],
        floors:
          applicationDetail.floors?.map((floor: any) => {
            // Calculate volume for floor
            const volume = calculateVolume(
              floor.height || 0,
              floor.width || 0,
              floor.quantity || 0,
            );

            return {
              _uid: getRandomId("floor_"),
              id: floor.application_floor_id || 0,
              floor_id: floor.floor_id || null,
              floor: floor.floor, // Include the full object
              height: floor.height || 0,
              width: floor.width || 0,
              quantity: floor.quantity || 0,
              style: floor.style || "",
              volume: volume,
            };
          }) || [],
        windowsills:
          applicationDetail.windowsills?.map((windowsill: any) => {
            // Calculate volume for windowsill
            const volume = calculateVolume(
              windowsill.height || 0,
              windowsill.width || 0,
              windowsill.quantity || 0,
            );

            return {
              _uid: getRandomId("windowsill_"),
              id: windowsill.application_windowsill_id || 0,
              windowsill_id: windowsill.windowsill_id || null,
              windowsill: windowsill.windowsill, // Include the full object
              height: windowsill.height || 0,
              width: windowsill.width || 0,
              quantity: windowsill.quantity || 0,
              style: windowsill.style || "",
              volume: volume,
            };
          }) || [],
        lattings:
          applicationDetail.lattings?.map((latting: any) => {
            // Calculate volume for latting
            const volume = calculateVolume(
              latting.height || 0,
              latting.width || 0,
              latting.quantity || 0,
            );

            return {
              _uid: getRandomId("latting_"),
              id: latting.application_latting_id || 0,
              latting_id: latting.latting_id || null,
              latting: latting.latting, // Include the full object
              height: latting.height || 0,
              width: latting.width || 0,
              quantity: latting.quantity || 0,
              style: latting.style || "",
              volume: volume,
            };
          }) || [],
        frameworks:
          applicationDetail.frameworks?.map((framework: any) => {
            // Calculate volume for framework
            const volume = calculateVolume(
              framework.height || 0,
              framework.width || 0,
              framework.quantity || 0,
            );

            return {
              _uid: getRandomId("framework_"),
              id: framework.application_framework_id || 0,
              framework_id: framework.framework_id || null,
              framework: framework.framework, // Include the full object
              height: framework.height || 0,
              width: framework.width || 0,
              quantity: framework.quantity || 0,
              style: framework.style || "",
              volume: volume,
            };
          }) || [],
        decorations:
          applicationDetail.decorations?.map((decoration: any) => {
            return {
              _uid: getRandomId("decoration_"),
              id: decoration.application_decoration_id || 0,
              decoration_id: decoration.decoration_id || null,
              decoration: decoration.decoration, // Include the full object
              quantity: decoration.quantity || 0,
            };
          }) || [],
        application_services: applicationServices,
        services: applicationServices,
        application_qualities: applicationQualities,
        qualities: applicationQualities,
      };

      form.setFieldsValue(transformedData as any);
    }
  }, [applicationDetail, isLoadingDetail, form]);

  const handleSave = () => {
    form.validateFields().then(({ general }) => {
      const generalValues = (general ?? {}) as Record<string, any>;
      const transactions = form.getFieldValue("transactions") || [];
      const applicationAspects =
        form.getFieldValue("application_aspects") || [];
      const sheathings = form.getFieldValue("sheathings") || [];
      const baseboards = form.getFieldValue("baseboards") || [];
      const floors = form.getFieldValue("floors") || [];
      const windowsills = form.getFieldValue("windowsills") || [];
      const lattings = form.getFieldValue("lattings") || [];
      const frameworks = form.getFieldValue("frameworks") || [];
      const decorations = form.getFieldValue("decorations") || [];
      const applicationServices =
        form.getFieldValue("application_services") || [];
      const applicationQualities =
        form.getFieldValue("application_qualities") || [];

      // Validate that at least one transaction/product exists
      if (transactions.length === 0) {
        toast("Необходимо добавить хотя бы один продукт в перечень", "error");
        return;
      }

      const customerId = getValue("customer_id", generalValues?.customer_id);

      const applicationTransactions = transactions.map(
        ({
          _uid,
          id,
          application_transaction_id,
          ...transaction
        }: any) => {
          const normalized = buildTransactionPayload(transaction);
          const identifier =
            application_transaction_id ?? id ?? null;

          return {
            ...normalized,
            application_transaction_id: identifier,
          };
        },
      );

      const rawData = {
        ...generalValues,
        customer_id: customerId,
        datetime: getDateTime(generalValues?.datetime),
        production_date: generalValues?.production_date
          ? getDateTime(generalValues?.production_date)
          : undefined,
        application_date: generalValues?.application_date
          ? getDateTime(generalValues.application_date)
          : null,
        delivery_date: generalValues?.delivery_date
          ? getDateTime(generalValues.delivery_date)
          : null,
        color:
          generalValues?.color?.name || (generalValues as any)?.color || "",
        door_lock_id: generalValues?.door_lock
          ? parseInt(generalValues.door_lock)
          : null,
        canopy_id: generalValues?.canopy
          ? parseInt(generalValues.canopy)
          : null,
        default_hinge_id: extractId(generalValues?.default_hinge_id),
        default_door_lock_id: extractId(generalValues?.default_door_lock_id),
        box_width: generalValues?.box_width || null,
        transom_height_front: generalValues?.transom_height_front || 0,
        transom_height_back: generalValues?.transom_height_back || 0,
        status: generalValues?.status || 1,
        application_transactions: applicationTransactions,
        transactions:
          applicationTransactions,
        application_aspects:
          applicationAspects?.map(({ _uid, id, ...item }: any) => ({
            application_aspect_id: id || null,
            ...item,
          })) || [],
        aspects:
          applicationAspects?.map(({ _uid, id, ...item }: any) => ({
            application_aspect_id: id || null,
            ...item,
          })) || [],
        sheathings:
          sheathings?.map(({ _uid, ...item }: any) => ({
            ...item,
            sheathing_id: getValue("sheathing_id", item?.sheathing_id),
          })) || [],
        baseboards:
          baseboards?.map(({ _uid, ...item }: any) => ({
            ...item,
            baseboard_id: getValue("baseboard_id", item?.baseboard_id),
          })) || [],
        floors:
          floors?.map(({ _uid, ...item }: any) => ({
            ...item,
            floor_id: getValue("floor_id", item?.floor_id),
          })) || [],
        windowsills:
          windowsills?.map(({ _uid, ...item }: any) => ({
            ...item,
            windowsill_id: getValue("windowsill_id", item?.windowsill_id),
          })) || [],
        lattings:
          lattings?.map(({ _uid, ...item }: any) => ({
            ...item,
            latting_id: getValue("latting_id", item?.latting_id),
          })) || [],
        frameworks:
          frameworks?.map(({ _uid, ...item }: any) => ({
            ...item,
            framework_id: getValue("framework_id", item?.framework_id),
          })) || [],
        decorations:
          decorations?.map(({ _uid, ...item }: any) => ({
            ...item,
            decoration_id: getValue("decoration_id", item?.decoration_id),
          })) || [],
        application_services:
          applicationServices?.map(({ _uid, id, ...item }: any) => ({
            application_service_id: id || null,
            service_id: getValue("service_id", item?.service_id),
            quantity: item?.quantity,
            source: item?.source,
          })) || [],
        services:
          applicationServices?.map(({ _uid, id, ...item }: any) => ({
            application_service_id: id || null,
            service_id: getValue("service_id", item?.service_id),
            quantity: item?.quantity,
            source: item?.source,
          })) || [],
        application_qualities:
          applicationQualities?.map(({ _uid, id, ...item }: any) => ({
            application_quality_id: id || null,
            quality_id: getValue("quality_id", item?.quality_id),
          })) || [],
        qualities:
          applicationQualities?.map(({ _uid, id, ...item }: any) => ({
            application_quality_id: id || null,
            quality_id: getValue("quality_id", item?.quality_id),
          })) || [],
      };

      mutate({
        id: id as string,
        formData: rawData,
      });
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/bids");
  };

  function getValue<T = unknown>(key: string, value: any): T {
    if (value && typeof value === "object" && key in value) {
      return value[key];
    }
    // Return null instead of 0 for empty values to avoid foreign key violations
    if (value === 0 || value === "0" || value === "") {
      return null as T;
    }
    return value;
  }

  // Calculate volume for various components
  const calculateVolume = (
    height: number,
    width: number,
    quantity: number,
  ): number => {
    return (height || 0) * (width || 0) * (quantity || 0);
  };

  // Calculate length for baseboards
  const calculateLength = (length: number, quantity: number): number => {
    return (length || 0) * (quantity || 0);
  };

  // Calculate services based on form data
  // NOTE: Forecast API should NOT be called in edit mode, only in create mode
  const calculateServices = useCallback(async () => {
    // Do nothing in edit mode - forecast is only for creating applications
    return;
  }, []);

  // Calculate advanced transaction fields via API

  // Auto-calculate volumes when form values change
  const autoCalculateVolumes = useCallback(() => {
    const transactions = form.getFieldValue("transactions") || [];
    const sheathings = form.getFieldValue("sheathings") || [];
    const baseboards = form.getFieldValue("baseboards") || [];
    const floors = form.getFieldValue("floors") || [];
    const windowsills = form.getFieldValue("windowsills") || [];
    const lattings = form.getFieldValue("lattings") || [];
    const frameworks = form.getFieldValue("frameworks") || [];

    // Update transactions with calculated volumes
    const updatedTransactions = transactions.map((transaction: any) => {
      const volume_product = calculateVolume(
        transaction.height || 0,
        transaction.width || 0,
        transaction.quantity || 0,
      );
      return { ...transaction, volume_product };
    });

    // Update sheathings with calculated volumes
    const updatedSheathings = sheathings.map((sheathing: any) => {
      const volume = calculateVolume(
        sheathing.height || 0,
        sheathing.width || 0,
        sheathing.quantity || 0,
      );
      return { ...sheathing, volume };
    });

    // Update baseboards with calculated volumes
    const updatedBaseboards = baseboards.map((baseboard: any) => {
      const volume = calculateLength(
        baseboard.length || 0,
        baseboard.quantity || 0,
      );
      return { ...baseboard, volume };
    });

    // Update floors with calculated volumes
    const updatedFloors = floors.map((floor: any) => {
      const volume = calculateVolume(
        floor.height || 0,
        floor.width || 0,
        floor.quantity || 0,
      );
      return { ...floor, volume };
    });

    // Update windowsills with calculated volumes
    const updatedWindowsills = windowsills.map((windowsill: any) => {
      const volume = calculateVolume(
        windowsill.height || 0,
        windowsill.width || 0,
        windowsill.quantity || 0,
      );
      return { ...windowsill, volume };
    });

    // Update lattings with calculated volumes
    const updatedLattings = lattings.map((latting: any) => {
      const volume = calculateVolume(
        latting.height || 0,
        latting.width || 0,
        latting.quantity || 0,
      );
      return { ...latting, volume };
    });

    // Update frameworks with calculated volumes
    const updatedFrameworks = frameworks.map((framework: any) => {
      const volume = calculateVolume(
        framework.height || 0,
        framework.width || 0,
        framework.quantity || 0,
      );
      return { ...framework, volume };
    });

    // Update form with calculated values
    form.setFieldsValue({
      transactions: updatedTransactions,
      sheathings: updatedSheathings,
      baseboards: updatedBaseboards,
      floors: updatedFloors,
      windowsills: updatedWindowsills,
      lattings: updatedLattings,
      frameworks: updatedFrameworks,
    });
  }, [form]);

  // Handle form values change
  const handleFormValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      // Check if volume-related fields changed
      const volumeFields = [
        "transactions",
        "sheathings",
        "baseboards",
        "floors",
        "windowsills",
        "lattings",
        "frameworks",
      ];
      const hasVolumeFieldChanged = Object.keys(changedValues).some((field) =>
        volumeFields.includes(field),
      );

      if (hasVolumeFieldChanged) {
        autoCalculateVolumes();
      }

      // Don't auto-calculate services when editing
      // Calculate services when transactions, baseboards, or windowsills change
      // if (
      //   changedValues.transactions ||
      //   changedValues.baseboards ||
      //   changedValues.windowsills
      // ) {
      //   calculateServices();
      // }
    },
    [autoCalculateVolumes],
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
        code={applicationDetail?.number}
        mode="edit"
        title={t("bids.edit.title")}
        loading={isLoading}
        addText={t("common.button.save")}
        onSave={handleSave}
        showCancelButton={true}
        onCancel={handleCancel}
      />

      <BidsTab
        mode="edit"
        formFinishErrors={formFinishErrors}
        isLoadingDetail={isLoadingDetail}
      />
    </Form>
  );
};
