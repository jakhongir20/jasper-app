import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { columns } from "@/features/sales/offer";
import type { ProductItem } from "@/features/sales/offer/model/offer.types";
import { useTableFetch } from "@/shared/hooks";
import { TableWrapper } from "@/shared/ui";

interface Props {
  dataId: number;
}

export const TabTableProducts: FC<Props> = ({ dataId }) => {
  const { t } = useTranslation();

  const { tableData, isLoading, pagination } = useTableFetch<ProductItem>(
    `offer-product/`,
    {
      offer: dataId,
    },
  );

  return (
    <TableWrapper<ProductItem>
      data={tableData}
      loading={isLoading}
      columns={columns(t)}
      clickableColumns={["product"]}
      pagination={pagination}
      showFilter={false}
      showDropdown={false}
      showAddButton={false}
    />
  );
};
