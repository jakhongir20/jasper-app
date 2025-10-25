import { ThemeConfig } from "antd";

export const antdThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#1d7488",
    colorPrimaryHover: "#29b7cd",
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Input: {
      colorText: "#111214",
    },
    DatePicker: {
      fontSize: 14,
      colorText: "#111214",
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 14,
      controlHeight: 40,
      boxShadow: "none",
    },
    Select: {
      // controlItemBgHover: "red", // Background color for hovered options
      // controlItemBgActive: "red", // Background color for active options
      // controlBg: "red", // Background color for the select control
      colorTextPlaceholder: "#111214",
      selectorBg: "#EAECEF",
      fontSize: 14,
      activeOutlineColor: "transparent",
    },
    Table: {
      headerBg: "#F8F9FA",
      headerColor: "#A4AAB0",
      borderRadius: 0,
      fontSize: 12,
      paddingContentHorizontal: 12,
      paddingContentVertical: 8,
      // @ts-expect-error padding
      padding: "7px 10px",
    },
  },
};
