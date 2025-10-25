import type { RadioChangeEvent } from "antd";
import { debounce } from "lodash";
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { PurchaseWithoutDeliveryList } from "@/features/purchase/no-ship/model/no-shipment.types";
import { useTableFetch, useToast } from "@/shared/hooks";
import { DuplicateForm } from "@/shared/types";
import { Modal, SearchInput, TableWrapper, Tabs } from "@/shared/ui";
import { PWDTableColumns } from "@/features/sales/sale/crud/TableColumns";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  fetchUrls: {
    label: string;
    value: string;
    fromModel: string;
    toModel: string;
    params?: Record<string, any>;
  }[];
}

export const DuplicateModal: FC<Props> = ({
  isOpen,
  closeModal,
  fetchUrls,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState(fetchUrls[0].value);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedParams =
    fetchUrls.find((item) => item.value === selectedType)?.params || {};

  const { tableData, isLoading, pagination } =
    useTableFetch<PurchaseWithoutDeliveryList>(selectedType, {
      q: searchText,
      ...selectedParams,
    });

  const handleTabChange = (key: string) => {
    setSelectedType(key);
  };

  const debounceSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearchText(text);
      }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearch(inputValue);
      debounceSearch(inputValue.trim());
    },
    [debounceSearch],
  );

  const resetSearch = useCallback(() => {
    setSearch("");
    setSearchText("");
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedId(null);
    resetSearch();
    closeModal();
  }, [resetSearch, closeModal]);

  const { mutate: duplicate, isPending: isLoadingDuplicate } = useDuplicate({
    onSuccess: (res) => {
      handleCloseModal();
      toast(t("common.toast.duplicate"), "success");
      navigate(`/purchase/no-ship/edit/${res?.guid}`, {
        replace: true,
      });
    },
  });

  const handleSelectedValue = useCallback((event: RadioChangeEvent) => {
    setSelectedId(event.target.value);
  }, []);

  const fromModel =
    fetchUrls.find((item) => item.value === selectedType)?.fromModel || "offer";
  const toModel =
    fetchUrls.find((item) => item.value === selectedType)?.toModel || "offer";

  const handleConfirm = useCallback(() => {
    if (selectedId === null || isLoadingDuplicate) return;

    const formData: DuplicateForm = {
      from_id: selectedId,
      // @ts-ignore
      from_model: fromModel,
      // @ts-ignore
      to_model: toModel,
    };

    duplicate(formData);
  }, [selectedId, fromModel, duplicate, isLoadingDuplicate]);

  const columns = useMemo(
    () => PWDTableColumns(t, selectedId, handleSelectedValue),
    [t, selectedId, handleSelectedValue],
  );

  return (
    <Modal
      title={t("purchaseModule.add.addProduct")}
      open={isOpen}
      size="extra-large"
      className="!p-0"
      cancelText={t("common.button.undo")}
      saveBtnText={t("common.button.confirm")}
      onCancel={handleCloseModal}
      onSave={handleConfirm}
    >
      {/* Tabs Component */}
      <Tabs
        items={fetchUrls.map((tab) => ({
          key: tab.value,
          label: t(tab.label),
        }))}
        useQuery={false}
        activeTabKey={selectedType}
        onChange={handleTabChange}
      />

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
