import { Modal, Button } from "antd";
import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  guid: string;
  title: string;
}

export const DeleteAction: FC<Props> = ({ open, setOpen, guid, title }) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    // TODO: Implement delete functionality
    setOpen(false);
  };

  return (
    <Modal
      title={t("common.labels.deleteConfirmation")}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          {t("common.button.cancel")}
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          {t("common.button.delete")}
        </Button>,
      ]}
    >
      <p>
        {t("common.messages.deleteConfirmation")} "{title}"?
      </p>
    </Modal>
  );
};
