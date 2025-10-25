import i18n from "@/app/i18n";
import { Dropdown, Icon, Radio } from "@/shared/ui";
import { MenuProps } from "antd";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

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

export const HeaderLanguageTransparent: FC<Props> = () => {
  const { t } = useTranslation();
  const [locale, setLocale] = useState(localStorage.getItem("LOCALE") || "ru");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleChangeLocale = (value: "uz" | "ru" | "en") => {
    setLocale(value);
    localStorage.setItem("LOCALE", value);
    i18n.changeLanguage(value);
  };

  const localeItems: MenuProps["items"] = LOCALE_ITEMS.map((item) => ({
    key: item.value,
    label: (
      <div
        className={`flex h-6 items-center gap-2 ${
          locale === item.value ? "[&_*]:text-violet" : "text-black-100"
        }`}
        onClick={() => handleChangeLocale(item.value as "uz" | "ru" | "en")}
      >
        <p className="h-5 w-5 overflow-hidden rounded-full">
          <img
            className="h-full w-full"
            src={item.src}
            alt={`lang-${item.value}`}
          />
        </p>
        <span>{t(`common.locale.${item.value}`)}</span>
        <Radio
          className="ml-auto"
          name="group"
          checked={locale === item.value}
        />
      </div>
    ),
  }));

  return (
    <Dropdown
      rootClassName={`[&_.ant-dropdown-menu]:!mt-2`}
      menu={{
        items: localeItems,
        selectable: true,
        selectedKeys: [locale],
      }}
      placement="bottom"
      onOpenChange={(open) => setIsDropdownOpen(open)}
    >
      <div className="flex cursor-pointer items-center gap-1">
        <Icon icon="globe" color="white" />
        <span className="text-xs font-semibold">
          {t(`common.locale.${locale}`)}
        </span>
        <Icon
          icon="chevron-down"
          color="white"
          className={`transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </Dropdown>
  );
};
