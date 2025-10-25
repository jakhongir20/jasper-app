import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props<T> {
  className?: string;
  data: T[];
}

export const TableBox: FC<Props<any>> = ({ className, data }) => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-x-auto">
      {!data?.length ? (
        <div className="mx-auto w-full py-2 text-center text-xs font-semibold text-black">
          {t("common.table.emptyState.title")}
        </div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-600">
            <tr className="text-xs">
              <th className="w-12 border border-gray-800 px-4 py-2 text-center font-semibold text-black-100">
                №
              </th>
              <th className="border border-gray-800 px-4 py-2 text-left font-semibold text-black-100">
                {t("common.input.warehouse")}
              </th>
              <th className="border border-gray-800 px-4 py-2 text-center font-semibold text-black-100">
                {t("common.table.quantity")}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data?.map((row: any, index: number) => (
              <tr key={row.id} className="border border-gray-800">
                <td className="text-cente border border-gray-800 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-800 px-4 py-2">
                  {row.title}
                </td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  {row.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/*<div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-b from-white via-white/50 to-transparent"></div>*/}
    </div>
  );
};
