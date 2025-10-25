import { type FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, CInfo } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { type Category } from "@/features/admin/categories/model";

interface Props {
  category: Category;
  className?: string;
}

export const CategoryDetails: FC<Props> = ({ category, className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/categories/edit/${category.category_id}`);
  };

  const handleBack = () => {
    navigate("/admin/categories");
  };

  return (
    <div className={cn("px-10", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-gray-900">
          {t("common.labels.categoryDetails")}
        </h4>
        <div className="flex gap-4">
          <Button onClick={handleBack}>{t("common.button.back")}</Button>
          <Button type="primary" onClick={handleEdit}>
            {t("common.button.edit")}
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h5 className="mb-4 text-lg font-semibold text-gray-900">
          {t("common.labels.basicInformation")}
        </h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CInfo
            value={t("common.labels.id")}
            subValue={`#${category.category_id}`}
          />
          <CInfo
            value={t("common.labels.name")}
            subValue={category.name || "-"}
          />
          <CInfo
            value={t("common.labels.section")}
            subValue={category.section || "-"}
          />
        </div>
      </div>
    </div>
  );
};
