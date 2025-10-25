import { FC, ReactNode } from "react";
import { cn } from "@/shared/helpers";
import { useTranslation } from "react-i18next";
import { Dropdown, Icon } from "@/shared/ui";
import { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

interface Action {
  key: string | number;
  label: ReactNode;
  onClick?: () => void;
}

interface EditLink {
  link: string;
  state?: object;
}

interface Props {
  className?: string;
  showEdit?: boolean;
  editLink?: EditLink;
  onEdit?: () => void;
  showAdd?: boolean;
  addLink?: EditLink;
  onAdd?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  additionalActions?: Action[];
}

export const TableAction: FC<Props> = ({
  className,
  showEdit = true,
  editLink,
  onEdit,
  showAdd = false,
  addLink,
  onAdd,
  showDelete = true,
  onDelete,
  additionalActions = [],
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (editLink) {
      navigate(editLink.link, { state: editLink.state });
    } else if (onEdit) {
      onEdit();
    }
  };
  const handleAddClick = () => {
    if (addLink) {
      navigate(addLink.link, { state: addLink.state });
    } else if (onAdd) {
      onAdd();
    }
  };

  const localeItems: MenuProps["items"] = [
    showEdit && {
      key: "edit",
      label: (
        <div className="flex select-none items-center gap-2">
          <Icon icon="pen-square" className={"w-5"} />
          <p className="text-sm font-medium text-black">
            {t("common.button.edit")}
          </p>
        </div>
      ),
      onClick: handleEditClick,
    },
    showAdd && {
      key: "add",
      label: (
        <div className="flex select-none items-center gap-2">
          <Icon icon="plus" className={"w-5"} />
          <p className="text-sm font-medium text-black">
            {t("common.button.add")}
          </p>
        </div>
      ),
      onClick: handleAddClick,
    },
    {
      type: "divider",
    },
    ...additionalActions.map((action) => ({
      key: action.key,
      label: (
        <div
          className="flex select-none items-center gap-2"
          onClick={action.onClick}
        >
          {action.label}
        </div>
      ),
    })),
    ...(additionalActions.length ? [{ type: "divider" }] : []),
    showDelete && {
      key: "delete",
      label: (
        <div className="flex select-none items-center gap-2">
          <Icon icon="trash" className={"w-5 text-red"} />
          <p className="text-sm font-medium text-black">
            {t("common.button.delete")}
          </p>
        </div>
      ),
      onClick: onDelete,
    },
    //     @ts-ignore
  ].filter((item): item is MenuProps["items"][number] => Boolean(item));

  return (
    <Dropdown
      className={cn(className)}
      rootClassName={
        "[&_.ant-dropdown-menu]:!p-0 [&_.ant-dropdown-menu]:!border [&_.ant-dropdown-menu]:!border-gray-100 [&_.ant-dropdown-menu]:!mt-3  [&_.ant-dropdown-menu-item]:!rounded-none [&_.ant-dropdown-menu-item]:!p-3 [&_.ant-dropdown-menu-item-divider]:!m-0"
      }
      menu={{ items: localeItems }}
    >
      <div
        id={"deleteId"}
        className="group absolute right-0 top-0 flex size-4 h-full w-10 cursor-pointer !select-none justify-center"
      >
        <div className="flex h-full items-center justify-center">
          <Icon icon="more" width={18} color="text-gray-300" />
        </div>
      </div>
    </Dropdown>
  );
};
