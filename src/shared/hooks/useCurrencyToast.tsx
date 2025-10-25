import { notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { HAS_CURRENT_NOTIFY_KEY } from "@/shared/constants";
import { Button } from "@/shared/ui";

export const useCurrencyToast = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "autoUpdate" | "manualInput" | null
  >(null);

  const modalVisibleRef = useRef(false); // ← новое

  useEffect(() => {
    modalVisibleRef.current = isModalVisible; // ← отслеживаем актуальное значение
  }, [isModalVisible]);

  const handleButtonClick = (
    type: "autoUpdate" | "manualInput",
    key: string,
  ) => {
    setModalType(null);
    setIsModalVisible(true);
    notification.destroy(key);
    setTimeout(() => {
      setModalType(type);
    }, 10);
  };

  const toast = () => {
    if (isNotificationOpen) return;

    const key = "currency-toast";
    setIsNotificationOpen(true);

    notification.open({
      key,
      message: null, // No title
      description: (
        <div className="flex h-full w-full max-w-lg justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex-center size-10 rounded-lg bg-violet">
              <img
                alt={t("common.alt.dmsLogo")}
                src="/logo.svg"
                className="aspect-square size-8 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-3 text-left">
              <div>
                <p className="text-sm font-medium">
                  {t("crmModule.notification.currency.title")}
                </p>

                <span className="text-xs">
                  {t("crmModule.notification.currency.info")}
                </span>
              </div>

              <div className="flex-y-center gap-2 [&_button]:!w-full">
                <Button onClick={() => handleButtonClick("autoUpdate", key)}>
                  {t("common.button.autoUpdate")}
                </Button>

                <Button
                  type="primary"
                  className="!bg-violet"
                  onClick={() => handleButtonClick("manualInput", key)}
                >
                  {t("common.button.manualInput")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 0, // Keep the notification open until manually closed
      className:
        "[&_.ant-notification-notice]:!bg-white [&_.ant-notification-notice]:shadow-lg [&_.ant-notification-notice]:!text-black",
      icon: null, // No default icon
      onClose: () => {
        localStorage.setItem(HAS_CURRENT_NOTIFY_KEY, JSON.stringify(false));
        setIsNotificationOpen(false);
      },
    });
  };

  return {
    toast,
    setIsModalVisible,
    modalType,
    isModalVisible,
    isNotificationOpen,
    modalVisibleRef,
  };
};
