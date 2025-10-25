import { Pagination as ANTDPagination, TablePaginationConfig } from "antd";
import { Select } from "@/shared/ui";
import { cn } from "@/shared/helpers";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { scrollToTopRobust } from "@/shared/utils/scrollUtils";

type Props = {
  total: number;
  currentPage: number;
  limit: number;
};

const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

export const Pagination = ({
  total,
  limit: currentLimit,
  currentPage,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLimitSelect = (value: number) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("limit", value.toString());
    updatedParams.set("page", "1");
    setSearchParams(updatedParams);
    // Delay scroll to ensure URL change has propagated
    setTimeout(() => scrollToTopRobust(), 100);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("page", page.toString());
    updatedParams.set("limit", pageSize.toString());

    setSearchParams(updatedParams);
    // Delay scroll to ensure URL change has propagated
    setTimeout(() => scrollToTopRobust(), 100);
  };

  // Scroll to top when currentPage changes (e.g., from URL changes)
  useEffect(() => {
    // Small delay to ensure DOM has updated
    setTimeout(() => scrollToTopRobust(), 50);
  }, [currentPage]);

  const paginationConfig: TablePaginationConfig = {
    current: currentPage,
    pageSize: currentLimit,
    position: ["bottomCenter"],
    showSizeChanger: false,
    pageSizeOptions: ["10", "20", "50", "100"],
    total: total ? total : 0,
  };

  return (
    <div className={cn("flex-y-center justify-end gap-4 px-0 py-3")}>
      {total > 10 && (
        <ANTDPagination
          {...paginationConfig}
          current={currentPage}
          pageSize={currentLimit}
          onChange={handlePageChange}
        />
      )}

      <Select
        defaultValue={10}
        value={currentLimit}
        className="!min-w-20 rounded-md border border-gray-800 bg-gray-600"
        options={pageSizeOptions}
        onSelect={handleLimitSelect}
      />
    </div>
  );
};
