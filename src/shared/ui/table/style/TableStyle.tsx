import { createStyles } from "antd-style";

export const useTableStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-pagination {
        .ant-pagination-item {
          border: 1px solid #eaecef !important;
          font-size: 14px !important;
          font-weight: 500 !important;

          * {
            color: #a4aab0 !important;
          }
        }

        .ant-pagination-item-active {
          background-color: #353a40 !important;
          color: #fff !important;
          border-color: #353a40 !important;

          * {
            color: #fff !important;
          }
        }
      }

      .ant-table {
        position: relative;

        .ant-table-container {
          border-radius: 0;
          border: none !important;
          overflow: unset !important;
          font-weight: 500;
          font-size: 14px;

          .ant-table-cell {
            border-color: #eaecef !important;
          }

          .ant-table-thead {
            .ant-table-cell {
              border-radius: 0 !important;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              border-color: #eaecef !important;
            }
          }

          }
          }
          `,
  };
});

// .ant-table-body,
// .ant-table-content {
//   scrollbar-width: thin;
//   scrollbar-color: #afb5bc transparent;
//   scrollbar-gutter: stable;
//   //overflow: unset !important; // testing
// }