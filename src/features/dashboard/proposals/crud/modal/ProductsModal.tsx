import {
  type ChangeEvent,
  type FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Form, type FormInstance, type RadioChangeEvent, Tooltip } from "antd";
import { Checkbox, Icon, Modal, SearchInput, TableWrapper } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { useTableFetch } from "@/shared/hooks";
import { Product } from "@/features/purchase/no-ship/model/no-shipment.types";
import { useSearchParams } from "react-router-dom";
import { formattedPrice, getRandomId } from "@/shared/helpers";

interface Props {
  form: FormInstance;
  mode: "add" | "edit";
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  short?: boolean;
  params?: Record<string, string | number | object | unknown>;
}

export const ProductsModal: FC<Props> = ({
  form,
  mode,
  isOpen,
  closeModal,
  title,
  short = true,
  params = {},
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = Form.useWatch("products", form);

  const [search, setSearch] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectData, setSelectData] = useState<Product[]>([]);

  const { tableData, isLoading, pagination } = useTableFetch<Product>(
    "/product/",
    { q: searchText, total: true, short, ...params },
    ["status", "tab", "request-type", "return-tab-id"],
  );

  useEffect(() => {
    if (mode == "edit" && products?.length) {
      setSelectData(products);
    }
  }, [products]);

  const resetSearch = () => {
    setSearchText("");
    setSearch("");
  };

  const handleCloseModal = () => {
    resetSearch();
    closeModal();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceSearch(e.target.value?.trim());
  };

  const debounceSearch = useCallback(
    debounce((text: string) => {
      setSearchText(text);
    }, 500),
    [],
  );

  const handleSelectedValue = (event: RadioChangeEvent) => {
    const { value } = event.target;
    const isSelected = selectedIds.includes(value);

    setSelectedIds((prev) =>
      isSelected ? prev.filter((id) => id !== value) : [...prev, value],
    );

    setSelectData((prev) =>
      isSelected
        ? prev.filter((item) => item?.id && item.id !== value)
        : [
            ...prev,
            ...tableData
              .filter((item) => item?.id && item.id === value)
              .map((p) => ({
                ...p,
                location: "",
                product: p.id,
                batch: form.getFieldValue("batch"),
                _uid: getRandomId(),
              })),
          ],
    );
  };

  const handleConfirm = () => {
    if (selectData?.length) {
      const validData = selectData
        .filter((item) => !!item.id)
        .map((p) => ({
          ...p,
          uom: p.uom?.id ?? p.uom,
        }));

      form.setFieldsValue({ products: validData });
    }

    setSelectedIds([]);

    const requestType = searchParams.get("request-type");

    if (requestType) {
      setSearchParams({
        ["request-type"]: requestType,
        ["return-tab-id"]: searchParams.get("return-tab-id") || requestType,
        tab: 2,
      } as unknown as URLSearchParams);
    }
    closeModal();
  };

  const checkIsDuplicate = (id: Product["id"]) => {
    const products: Product[] = form.getFieldValue("products") || [];
    if (!products.length) {
      return;
    }

    return products.find((p) => p.id === id);
  };

  useEffect(() => {
    if (products && products?.length) {
      setSelectData(products);
    }
  }, [products]);

  const columns = [
    {
      title: "-/-",
      dataIndex: "",
      width: 60,
      className: "text-center",
      render: (record: Product) => (
        <div className="flex-center gap-2">
          <Checkbox
            name="product"
            value={record.id}
            checked={selectedIds.includes(record.id)}
            onChange={handleSelectedValue}
          />

          {checkIsDuplicate(record?.id) && selectedIds.includes(record?.id) ? (
            <Tooltip title={t("common.alreadySelected")}>
              <Icon
                icon="toast-warning"
                size={10}
                height={20}
                width={20}
                color="text-yellow-500"
                className="duration-300 animate-in fade-in-35"
              />
            </Tooltip>
          ) : (
            ""
          )}
        </div>
      ),
    },
    {
      title: t("common.table.productName"),
      dataIndex: "title",
    },
    {
      title: t("common.table.remainingStock"),
      dataIndex: "totalQuantity",
      render: (quantity: string) => (quantity ? formattedPrice(quantity) : 0),
    },
    {
      title: t("common.table.measurement"),
      dataIndex: "uom",
      render: (record: Product["uom"]) => record?.shortName || "-",
    },
  ];

  return (
    <Modal
      title={title}
      open={isOpen}
      size={"extra-large"}
      className="!p-0"
      cancelText={t("common.button.undo")}
      saveBtnText={t("common.button.confirm")}
      onCancel={handleCloseModal}
      onSave={handleConfirm}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div>
          <div className="text-base font-semibold text-black">
            {t("common.details.allProducts")}
          </div>
          <p className="text-xs font-medium text-gray-500">
            {pagination?.total} {t("common.details.products")}
          </p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            placeholder={t("common.search.title")}
            value={search}
            defaultValue={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <TableWrapper
        data={tableData}
        loading={isLoading}
        columns={columns}
        showFilter={false}
        showDropdown={false}
        pagination={pagination}
        showAddButton={false}
      />
    </Modal>
  );
};
