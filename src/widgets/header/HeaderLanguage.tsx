import { FC, useState, useEffect } from "react";
import { Dropdown, Icon, Radio } from "@/shared/ui";
import { MenuProps } from "antd";
import i18n from "@/app/i18n";
import { useTranslation } from "react-i18next";
import { cn, rotateIcon } from "@/shared/helpers";

interface Props {
  className?: string;
}

const LOCALE_ITEMS = [
  {
    value: "uz",
    src: "/svg/lang-uz.svg",
  },
  {
    value: "ru",
    src: "/svg/lang-ru.svg",
  },
  {
    value: "en",
    src: "/svg/lang-en.svg",
  },
];

export const HeaderLanguage: FC<Props> = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [locale, setLocale] = useState<string>("ru");
  const [open, setOpen] = useState(false);

  // Initialize locale from localStorage or default to "ru"
  useEffect(() => {
    const savedLocale = localStorage.getItem("LOCALE") || "ru";
    setLocale(savedLocale);

    // Ensure i18n is using the correct language
    if (i18nInstance.language !== savedLocale) {
      i18nInstance.changeLanguage(savedLocale);
    }
  }, [i18nInstance]);

  const handleChangeLocale = (value: "uz" | "ru" | "en") => {
    try {
      setOpen(false); // Close the dropdown first
      setLocale(value);
      localStorage.setItem("LOCALE", value);

      // Change the language in i18n
      i18nInstance.changeLanguage(value);

      // Force a re-render by updating the i18n instance
      i18n.changeLanguage(value);
    } catch (error) {}
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const localeItems: MenuProps["items"] = LOCALE_ITEMS.map((item) => ({
    key: item.value,
    onClick: () => {
      handleChangeLocale(item.value as "uz" | "ru" | "en");
    },
    label: (
      <div className={`flex h-6 items-center justify-between gap-2`}>
        <div className={"flex flex-row gap-2"}>
          <p className="h-5 w-5 overflow-hidden rounded-full">
            <img
              className="h-full w-full"
              src={item.src}
              alt={`lang-${item.value}`}
            />
          </p>
          <span className="text-xs sm:text-sm">
            {t(`common.locale.${item.value}`)}
          </span>
        </div>
        <Radio className="ml-2" name="group" checked={locale === item.value} />
      </div>
    ),
  }));

  // Get the current language name for display
  const currentLanguageName = t(`common.locale.${locale}`);

  return (
    <Dropdown
      rootClassName={`[&_.ant-dropdown-menu]:!mt-2 [&_.ant-dropdown-menu-item-selected]:!bg-primary/10 [&_.ant-dropdown-menu-item]:!pr-2`}
      menu={{
        items: localeItems,
        selectable: true,
        selectedKeys: [locale],
      }}
      placement="bottom"
      onOpenChange={handleOpen}
      trigger={["click"]}
    >
      <div className="flex cursor-pointer items-center transition-opacity duration-200 hover:opacity-80">
        <p className="h-4 w-4 overflow-hidden rounded-full sm:h-5 sm:w-5">
          <img
            className="h-full w-full"
            src={`/svg/lang-${locale}.svg`}
            alt={`lang-${locale}`}
            loading="lazy"
          />
        </p>
        <span className="ml-1 hidden text-xs font-semibold xs:block sm:ml-1.5">
          {currentLanguageName}
        </span>
        <Icon
          icon="chevron-down"
          color="text-white"
          className={cn(rotateIcon(open), "transition-transform duration-200")}
          height={14}
        />
      </div>
    </Dropdown>
  );
};
