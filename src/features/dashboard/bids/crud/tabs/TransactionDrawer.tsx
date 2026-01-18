import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Drawer, Form, message, Tabs } from "antd";
import { Button } from "@/shared/ui";
import {
  getTransactionValidationPaths,
  getUnfilledRequiredFields,
  TransactionForm,
} from "@/features/dashboard/bids/crud/tabs/TransactionForm";
import { DoorBoxes2DForm } from "@/features/dashboard/bids/crud/tabs/DoorBoxes2DForm";
import {
  ApplicationLocalForm,
  GeneralFormType,
  TransactionFormType as Transaction,
} from "@/features/dashboard/bids/model";
import { ApiService } from "@/shared/lib/services";
import { getRandomId } from "@/shared/utils";
import { buildTransactionPayload } from "@/features/dashboard/bids/utils/transactionTransform";

interface Props {
  className?: string;
  open: boolean;
  onClose: (closed: boolean) => void;
  mode: "add" | "edit";
  transaction?: Transaction | null;
  /** Alternative to transaction - pass index to get transaction from parent form */
  transactionIndex?: number | null;
}

export const TransactionDrawer: FC<Props> = ({
  className,
  open,
  onClose,
  mode,
  transaction: transactionProp,
  transactionIndex,
}) => {
  const parentForm = Form.useFormInstance<ApplicationLocalForm>();

  // Get transaction either from prop or by index from parent form
  const transaction = useMemo(() => {
    if (transactionProp) return transactionProp;
    if (transactionIndex !== null && transactionIndex !== undefined) {
      const transactions = parentForm.getFieldValue("transactions") ?? [];
      return transactions[transactionIndex] ?? null;
    }
    return null;
  }, [transactionProp, transactionIndex, parentForm]);
  const [drawerForm] = Form.useForm<ApplicationLocalForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("perechen");
  const [sectionsExpanded, setSectionsExpanded] = useState(false);
  const [sectionsEnabled, setSectionsEnabled] = useState(false);
  const originalTransactionsRef = useRef<Record<string, any>[]>([]);

  // Initialize drawer form when opened
  useEffect(() => {
    if (!open) {
      return;
    }

    // Save original transactions from parent form
    const currentTransactions =
      (parentForm.getFieldValue("transactions") as Record<string, any>[]) || [];

    originalTransactionsRef.current = Array.isArray(currentTransactions)
      ? currentTransactions.map((item) =>
          item && typeof item === "object" ? { ...item } : item,
        )
      : [];

    // Get general form values from parent to maintain consistency
    const generalValues = parentForm.getFieldValue(
      "general",
    ) as GeneralFormType;

    // Set up drawer form with transaction data only
    if (mode === "edit" && transaction) {
      drawerForm.setFieldsValue({
        general: generalValues,
        transactions: [{ ...transaction }],
      });
    } else {
      drawerForm.setFieldsValue({
        general: generalValues,
        transactions: [{}],
      });
    }
  }, [parentForm, drawerForm, mode, open, transaction]);

  const handleCancel = useCallback(() => {
    // Simply close without saving - parent form is never modified
    drawerForm.resetFields();
    onClose(false);
  }, [drawerForm, onClose]);

  const handleDrawerClose = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const transactions = drawerForm.getFieldValue("transactions") || [];
    const currentTransaction = (transactions?.[0] as Record<string, any>) || {};

    // Check for unfilled required fields
    const unfilledFields = getUnfilledRequiredFields(currentTransaction);
    if (unfilledFields.length > 0) {
      // Set validation errors for unfilled fields to show red borders
      const fieldsWithErrors = unfilledFields.map((field) => ({
        name: ["transactions", 0, field.name] as (string | number)[],
        errors: [`Заполните поле «${field.label}»`],
      }));
      drawerForm.setFields(fieldsWithErrors as any);

      const fieldNames = unfilledFields.map((f) => f.label).join(", ");
      message.warning(`Заполните обязательные поля: ${fieldNames}`, 5);
      return;
    }

    const validationPaths = getTransactionValidationPaths(currentTransaction);

    try {
      await drawerForm.validateFields(validationPaths as any);
    } catch (error) {
      message.error("Заполните обязательные поля");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildTransactionPayload(currentTransaction);
      const response = await ApiService.$post<Record<string, any>>(
        "/application/transaction-auditor",
        payload,
      );

      const succeeded =
        response && typeof response === "object"
          ? "succeeded" in response
            ? Boolean(response.succeeded)
            : "success" in response
              ? Boolean(response.success)
              : true
          : true;

      if (!succeeded) {
        const errorMessage =
          (response as any)?.message ??
          (response as any)?.detail ??
          "Не удалось подтвердить транзакцию";
        message.error(errorMessage);
        return;
      }

      let transactionToStore: Record<string, any> = {
        ...currentTransaction,
      };

      if (
        response &&
        typeof response === "object" &&
        "payload" in response &&
        response.payload &&
        typeof response.payload === "object"
      ) {
        transactionToStore = {
          ...transactionToStore,
          ...response.payload,
        };
      }

      if (
        response &&
        typeof response === "object" &&
        "results" in response &&
        response.results &&
        typeof response.results === "object"
      ) {
        transactionToStore = {
          ...transactionToStore,
          ...response.results,
        };
      }

      const productTypeValue =
        transactionToStore.product_type ??
        transactionToStore.door_type ??
        currentTransaction.product_type ??
        currentTransaction.door_type ??
        null;

      transactionToStore = {
        ...transactionToStore,
        product_type: productTypeValue,
        door_type: productTypeValue,
        height:
          transactionToStore.height ??
          transactionToStore.opening_height ??
          null,
        width:
          transactionToStore.width ?? transactionToStore.opening_width ?? null,
        doorway_thickness:
          transactionToStore.doorway_thickness ??
          transactionToStore.opening_thickness ??
          null,
        quantity:
          transactionToStore.quantity ??
          transactionToStore.entity_quantity ??
          null,
      };

      const originalList = Array.isArray(originalTransactionsRef.current)
        ? [...originalTransactionsRef.current]
        : [];

      const matchTransaction = (item: Record<string, any>) => {
        if (transaction?._uid && item?._uid) {
          return item._uid === transaction._uid;
        }

        if (
          transaction?.id !== undefined &&
          transaction?.id !== null &&
          item?.id !== undefined &&
          item?.id !== null
        ) {
          return item.id === transaction.id;
        }

        return false;
      };

      let updatedTransactions: Record<string, any>[];

      if (mode === "edit" && transaction) {
        let hasMatch = false;
        updatedTransactions = originalList.map((item) => {
          if (!hasMatch && matchTransaction(item)) {
            hasMatch = true;
            return {
              ...item,
              ...transactionToStore,
              _uid:
                item._uid ?? transaction._uid ?? getRandomId("transaction_"),
            };
          }
          return item;
        });

        if (!hasMatch) {
          updatedTransactions = [
            ...updatedTransactions,
            {
              ...transactionToStore,
              _uid: transaction._uid ?? getRandomId("transaction_"),
            },
          ];
        }
      } else {
        updatedTransactions = [
          ...originalList,
          {
            ...transactionToStore,
            _uid: getRandomId("transaction_"),
          },
        ];
      }

      // Now commit to parent form only on successful confirmation
      parentForm.setFieldsValue({ transactions: updatedTransactions });
      drawerForm.resetFields();
      message.success("Транзакция успешно подтверждена");
      onClose(true);
    } catch (error: any) {
      const errorData = error?.response?.data;

      // Handle validation errors with detail array
      if (errorData?.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map((err: any) => {
          const field =
            err.loc && err.loc.length > 1
              ? err.loc[err.loc.length - 1]
              : "поле";
          const msg = err.msg || "Ошибка валидации";
          const input =
            err.input !== undefined ? ` (значение: ${err.input})` : "";
          return `${field}: ${msg}${input}`;
        });
        message.error(`Ошибка валидации: ${errorMessages.join("; ")}`, 8);
      } else if (errorData?.detail && typeof errorData.detail === "string") {
        // Handle string detail
        message.error(errorData.detail, 8);
      } else if (errorData?.message) {
        // Handle message field
        message.error(errorData.message, 8);
      } else if (error?.message) {
        // Handle general error message
        message.error(error.message, 8);
      } else {
        // Default error message
        message.error("Не удалось подтвердить транзакцию", 8);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [drawerForm, parentForm, isSubmitting, mode, onClose, transaction]);

  return (
    <Drawer
      placement={"bottom"}
      open={open}
      onClose={handleDrawerClose}
      destroyOnHidden
      closable
      width={"100%"}
      height={"100%"}
      maskClosable={false}
      className={className}
      styles={{
        body: {
          paddingTop: 0,
        },
      }}
      title={
        <div className={"flex items-center justify-between"}>
          <h1>
            {mode === "edit" ? "Редактировать перечень" : "Добавить перечень"}
          </h1>
          <div className={"flex gap-2"}>
            <Button onClick={handleCancel} type={"default"}>
              Отмена
            </Button>
            <Button
              type={"primary"}
              onClick={handleConfirm}
              loading={isSubmitting}
            >
              {mode === "edit" ? "Сохранить изменения" : "Подтвердить"}
            </Button>
          </div>
        </div>
      }
    >
      <Form layout={"vertical"} form={drawerForm} component={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "perechen",
              label: "Перечень",
              children: (
                <TransactionForm
                  mode={mode}
                  drawerOpen={open}
                  onDoorSectionToggle={setSectionsExpanded}
                  onSectionsEnabledChange={setSectionsEnabled}
                />
              ),
            },
            {
              key: "door-boxes-2d",
              label: "2D / Визуализация",
              children: (
                <DoorBoxes2DForm
                  mode={mode}
                  drawerOpen={open}
                  doorSectionExpanded={sectionsExpanded}
                />
              ),
            },
          ]}
        />
      </Form>
    </Drawer>
  );
};
