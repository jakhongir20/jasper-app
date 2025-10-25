import { iconNames } from "@/shared/types/icons";
import { Icon } from "@/shared/ui";
import { IconType } from "@/shared/types";
import { useToast } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

const IconsList = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(iconName).then(() => {
      toast(t("common.messages.iconCopied"), "success");
    });
  };

  // test 

  return (
    <main className="h-svh overflow-auto bg-slate-700">
      {iconNames?.length == 0 && (
        <div className="flex-center size-full flex-col gap-5 p-5">
          <h1 className="text-4xl font-bold text-white">
            {t("common.messages.iconsNotGenerated")}
          </h1>
          <img
            className="aspect-video h-[60svh]"
            src="https://i.pinimg.com/originals/30/31/b1/3031b1b4dc5c57b615821d479eefc235.gif"
            alt={t("common.messages.iconsNotGenerated")}
          />
        </div>
      )}

      <ul className="grid grid-cols-12 gap-10 p-5">
        {iconNames &&
          iconNames.length > 0 &&
          iconNames?.map((iconName) => {
            return (
              <li
                className="flex-center relative flex-col rounded-xl border p-4"
                key={iconName}
              >
                <button
                  className="absolute right-2 top-2 rounded bg-red-600 px-1.5 text-white"
                  onClick={() => copyToClipboard(iconName)}
                >
                  {t("common.button.copy")}
                </button>

                <Icon
                  className="size-16 text-blue"
                  key={iconName}
                  icon={iconName as IconType}
                  width="100%"
                />

                <span className="font-mono font-bold text-white">
                  {iconName}
                </span>
              </li>
            );
          })}
      </ul>
    </main>
  );
};

export default IconsList;
