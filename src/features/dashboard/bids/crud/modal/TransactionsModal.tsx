import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { Input, Modal } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { transactionFormFields } from "@/features/dashboard/bids";
import {
  ApplicationLocalForm,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids/model";
import { renderFormItemWithContext } from "@/features/dashboard/bids/utils";
import { getRandomId } from "@/shared/utils";
import { ApiService } from "@/shared/lib/services";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  initialValues?: Transaction;
}

export const TransactionsModal: FC<Props> = ({
  isOpen,
  closeModal,
  title,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Partial<Transaction>>();
  const parentForm = Form.useFormInstance<ApplicationLocalForm>();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [doorType, setDoorType] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        // If editing, use provided transaction values directly
        form.setFieldsValue(initialValues);
        // Set door type for validation
        setDoorType(initialValues.door_type || null);
      } else {
        // If adding new, reset form to empty state and populate with general form values
        form.resetFields();

        // Get general form values from parent form
        const generalValues = parentForm.getFieldValue("general");
        if (generalValues) {
          const defaultValues: Partial<Transaction> = {};

          // Map door_lock from general form to door_lock_id in transaction
          if (generalValues.door_lock) {
            defaultValues.door_lock_id = generalValues.door_lock;
          }

          // Map canopy from general form to canopy_id in transaction
          if (generalValues.canopy) {
            defaultValues.canopy_id = generalValues.canopy;
          }

          // Map transom height front from general form to transaction
          if (generalValues.transom_height_front) {
            defaultValues.transom_height_front =
              generalValues.transom_height_front;
          }

          // Map transom height back from general form to transaction
          if (generalValues.transom_height_back) {
            defaultValues.transom_height_back =
              generalValues.transom_height_back;
          }

          // Set the default values if any exist
          if (Object.keys(defaultValues).length > 0) {
            form.setFieldsValue(defaultValues);
          }
        }
      }
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [form, isOpen, initialValues, parentForm]);

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      const formValues = values;
      const currentTransactions =
        parentForm.getFieldValue("transactions") || [];

      if (initialValues) {
        // Update existing transaction
        const updatedTransactions = currentTransactions.map(
          (transaction: Transaction) =>
            transaction._uid === initialValues._uid
              ? { ...formValues, _uid: initialValues._uid }
              : transaction,
        );
        parentForm.setFieldValue("transactions", updatedTransactions);
      } else {
        // Add new transaction
        const newTransaction = {
          ...formValues,
          _uid: getRandomId("transaction_"),
        };
        const newTransactions = [...currentTransactions, newTransaction];

        parentForm.setFieldValue("transactions", newTransactions);
      }

      closeModal();
    });
  };

  const handleCloseModal = () => {
    form.resetFields();
    setDoorType(null);
    closeModal();
  };

  const calculateTransactionFields = useCallback(
    async (values: Partial<Transaction>) => {
      const { height, width, quantity } = values;

      // Only proceed if we have the required fields
      if (!height || !width || !quantity) {
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        const response = await ApiService.$post<{
          payload: any;
          results: {
            volume_product: number;
            sheathing_quantity: number;
            sheathing_thickness: number;
            sheathing_height: number;
            sheathing_width: number;
            trim_heigth: number;
            trim_height: number;
            trim_width: number;
            trim_quantity: number;
            crown_width: number;
            crown_quantity: number;
            up_trim_quantity: number;
            under_trim_quantity: number;
            glass_quantity: number;
            door_lock_quantity: number;
            canopy_quantity: number;
            latch_quantity: number;
            box_service_quantity: number;
            box_service_length: number;
          };
        }>(
          "/application/measure",
          {
            height,
            width,
            quantity,
            doorway_type: values.doorway_type || null,
            doorway_thickness: values.doorway_thickness || 0,
            frame_front_id:
              typeof values.frame_front_id === "object" &&
                (values.frame_front_id as any)?.framework_id
                ? (values.frame_front_id as any).framework_id
                : values.frame_front_id || null,
            frame_back_id:
              typeof values.frame_back_id === "object" &&
                (values.frame_back_id as any)?.framework_id
                ? (values.frame_back_id as any).framework_id
                : values.frame_back_id || null,
            trim_id:
              typeof values.trim_id === "object" &&
                (values.trim_id as any)?.product_id
                ? (values.trim_id as any).product_id
                : values.trim_id || null,
            filler_id:
              typeof values.filler_id === "object" &&
                (values.filler_id as any)?.product_id
                ? (values.filler_id as any).product_id
                : values.filler_id || null,
            sash: values.sash || null,
            box_width: values.box_width || null,
            threshold: values.threshold || null,
          },
          { signal: abortControllerRef.current.signal },
        );

        // Update form with calculated values
        if (response?.results) {
          form.setFieldsValue({
            ...response.results,
            volume_product: response.results.volume_product,
            sheathing_quantity: response.results.sheathing_quantity,
            sheathing_thickness: response.results.sheathing_thickness,
            sheathing_height: response.results.sheathing_height,
            sheathing_width: response.results.sheathing_width,
            trim_height:
              response.results.trim_height || response.results.trim_heigth, // Note: API has typo "heigth"
            trim_width: response.results.trim_width,
            trim_quantity: response.results.trim_quantity,
            crown_width: response.results.crown_width,
            crown_quantity: response.results.crown_quantity,
            up_trim_quantity: response.results.up_trim_quantity,
            under_trim_quantity: response.results.under_trim_quantity,
            glass_quantity: response.results.glass_quantity,
            door_lock_quantity: response.results.door_lock_quantity,
            canopy_quantity: response.results.canopy_quantity,
            latch_quantity: response.results.latch_quantity,
            box_service_quantity: response.results.box_service_quantity,
            box_service_length: response.results.box_service_length,
          });
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    },
    [form],
  );

  const debouncedCalculate = useCallback(
    (values: Partial<Transaction>) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced calculation
      timeoutRef.current = setTimeout(() => {
        calculateTransactionFields(values);
      }, 500); // 500ms debounce
    },
    [calculateTransactionFields],
  );

  return (
    <Modal
      title={title}
      open={isOpen}
      size={"extra-large"}
      className="!p-0"
      cancelText={t("common.button.undo")}
      saveBtnText={t("common.button.confirm")}
      onCancel={handleCloseModal}
      onSave={handleConfirm}
    >
      <Form
        layout="vertical"
        form={form}
        className="grid gap-4 p-5 lg:grid-cols-2"
        onValuesChange={(changedValues, allValues) => {
          // Track door_type changes for box_width validation
          if (changedValues.door_type !== undefined) {
            setDoorType(changedValues.door_type);
          }
          debouncedCalculate(allValues);
        }}
      >
        {/* Hidden field for _uid to maintain identity for editing */}
        <Form.Item name="_uid" hidden>
          <Input />
        </Form.Item>

        {transactionFormFields.map(renderFormItemWithContext({ doorType }))}
      </Form>
    </Modal>
  );
};
