import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { CREATE_SHIPMENT_ICONS } from "@/features/purchase/no-ship";
import { PWD_CREATE_TYPES } from "@/features/purchase/no-ship/ui/index";
import { cn } from "@/shared/helpers";
import { Icon, Modal } from "@/shared/ui";

interface Props {
  open: boolean;
  close: () => void;
  openDuplicateModal: () => void;
  navigateLink?: string;
}

const AddShipAction: FC<Props> = ({
  open,
  close,
  openDuplicateModal,
  navigateLink = "/purchase/no-ship/add",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<PWD_CREATE_TYPES>(
    PWD_CREATE_TYPES.NEW,
  );

  const handleSave = () => {
    if (selectedType === PWD_CREATE_TYPES.DUPLICATE) {
      openDuplicateModal();
      close();
    } else {
      navigate(navigateLink);
    }
  };

  return (
    <Modal
      title={t("purchaseModule.navigation.newArrivals")}
      open={open}
      saveBtnText={t("common.button.add")}
      cancelText={t("common.button.cancel")}
      onSave={handleSave}
      onCancel={close}
      centered
      size="middle"
      className={"!pb-0"}
    >
      <div className="flex-center gap-4">
        {CREATE_SHIPMENT_ICONS.map((icon, index) => (
          <div
            key={index}
            className={cn(
              "transition-300 group grid !size-48 shrink-0 cursor-pointer place-items-center rounded-lg border border-transparent bg-gray-100 p-2 text-center hover:border-violet/60",
              selectedType === index ? "!border-violet" : "",
            )}
            onClick={() => setSelectedType(icon.value)}
          >
            <Icon
              icon={icon.icon}
              className="mr-2"
              width="100%"
              color={cn(
                "text-blue-100 group-hover:text-violet/60 transition-300",
                selectedType === index ? "!text-violet" : "",
              )}
            />

            <span
              className={`${selectedType === index ? "font-semibold" : ""} transition-300 font-sans text-base group-hover:font-semibold`}
            >
              {t(icon.name)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-black-100">
        {t("purchaseModule.add.info")}
      </p>
    </Modal>
  );
};

export default AddShipAction;
