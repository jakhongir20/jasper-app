import type { FormInstance } from "antd";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { type FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { TabInfoForm, TabProductsForm } from "@/features/purchase/no-ship/crud";
import { getRandomId } from "@/shared/helpers";
import { ContentInner, Tabs } from "@/shared/ui";

interface Props {
  form: FormInstance;
  activeTabKey?: string;
  mode: "add" | "edit";
  groupTitle?: string;
  onChangeTab?: (key: string) => void;
  formFinishErrors: ValidateErrorEntity["errorFields"];
  isLoadingDetail?: boolean;
  id?: number;
}

export const ArrivalsTab: FC<Props> = ({
  form,
  mode,
  groupTitle,
  id,
  isLoadingDetail,
}) => {
  const { t } = useTranslation();

  const [createdContactItems, setCreatedContactItems] = useState<string[]>([]);
  const logistics = form.getFieldValue("cargo") || [];
  const addButtonClickedRef = useRef(false);

  // useEffect(() => {
  //   if (mode === "edit" && !isLoadingDetail) {
  //     if (!logistics?.length) {
  //       setCreatedContactItems([getRandomId()]);
  //     }
  //   }
  // }, [mode, isLoadingDetail, logistics]);

  const addCargo = () => {
    addButtonClickedRef.current = true;
    const UID = getRandomId();
    setCreatedContactItems((prevItems) => [...prevItems, String(UID)]);
    form.setFieldsValue({
      cargo: [
        ...(form.getFieldValue("cargo") || []),
        {
          _uid: UID,
        },
      ],
    });
  };

  useEffect(() => {
    if (mode === "edit" && !isLoadingDetail) {
      setCreatedContactItems(
        (logistics || []).map((item: { _uid?: string }) => String(item?._uid)),
      );
    }
  }, [mode, isLoadingDetail, logistics?.length]);

  const tabs = [
    {
      key: "1",
      label: t("crmModule.partners.details.tabs.generalInfo"),
      children: (
        <ContentInner>
          <TabInfoForm form={form} mode={mode} />
        </ContentInner>
      ),
    },
    {
      key: "2",
      label: t("productServiceModule.navigation.products"),
      children: (
        <TabProductsForm
          key={String(isLoadingDetail)}
          form={form}
          groupTitle={groupTitle}
          mode={mode}
          id={id}
        />
      ),
    },
    // {
    //   key: "3",
    //   label: t("common.details.cargo"),
    //   children: (
    //     <ContentInner className="pt-1">
    //       <TabCargoForm
    //         key={String(isLoadingDetail)}
    //         form={form}
    //         mode={mode}
    //         formFinishErrors={formFinishErrors}
    //         createdItems={createdContactItems}
    //         onSetCreatedItems={setCreatedContactItems}
    //         logistics={logistics}
    //         addButtonClickedRef={addButtonClickedRef?.current}
    //       />
    //       <Button
    //         type="default"
    //         icon={<Icon icon="plus" color="text-black" height={16} />}
    //         className="mt-5 !h-9"
    //         onClick={addCargo}
    //       >
    //         <span className="text-xs">
    //           {t("purchaseModule.add.addCargo", {
    //             n: createdContactItems.length + 1,
    //           })}
    //         </span>
    //       </Button>
    //     </ContentInner>
    //   ),
    // },
  ];

  return <Tabs items={tabs} />;
};
