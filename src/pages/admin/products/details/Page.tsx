import { useParams } from "react-router-dom";
import { ProductDetails } from "@/features/admin/products";
import { CAddHeader } from "@/shared/ui";

export default function Page() {
  const { guid: productId } = useParams<{ guid: string }>();

  return (
    <div className="px-10">
      <CAddHeader title="Product Details" />
      <ProductDetails />
    </div>
  );
}
