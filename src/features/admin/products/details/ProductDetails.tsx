import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProductDetail } from "@/features/admin/products";
import { CInfo, CInfoBadge, CTitle } from "@/shared/ui";

export const ProductDetails = () => {
  const { guid: productId } = useParams<{ guid: string }>();
  const { t } = useTranslation();
  const {
    data: product,
    isLoading,
    error,
  } = useProductDetail(Number(productId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="space-y-6">
      <CTitle value={product.name || "N/A"} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CInfo
          value={t("common.product.id")}
          subValue={product.product_id?.toString() || "N/A"}
        />
        <CInfo
          value={t("common.product.type")}
          subValue={product.product_type || "N/A"}
        />
        <CInfo
          value={t("common.product.priceUZS")}
          subValue={`${product.price_uzs || 0} UZS`}
        />
        <CInfo
          value={t("common.product.priceUSD")}
          subValue={`${product.price_usd || 0} USD`}
        />
        <CInfo
          value={t("common.product.measure")}
          subValue={product.measure || "N/A"}
        />
        <CInfo
          value={t("common.product.feature")}
          subValue={product.feature || "N/A"}
        />
        <CInfo
          value={t("common.product.crownCoefficient")}
          subValue={product.crown_coefficient?.toString() || "N/A"}
        />
        <CInfo
          value={t("common.product.upUnderTrimHeight")}
          subValue={product.up_under_trim_height?.toString() || "N/A"}
        />
        <CInfo
          value={t("common.product.upUnderTrimWidth")}
          subValue={product.up_under_trim_width?.toString() || "N/A"}
        />
      </div>

      {product.category && (
        <div className="space-y-4">
          <CTitle value={t("common.product.category")} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CInfo
              value={t("common.category.id")}
              subValue={product.category.category_id?.toString() || "N/A"}
            />
            <CInfo
              value={t("common.category.name")}
              subValue={product.category.name || "N/A"}
            />
            <CInfo
              value={t("common.category.section")}
              subValue={product.category.section?.toString() || "N/A"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
