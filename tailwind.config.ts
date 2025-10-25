// @ts-ignore
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      colors: {
        primary: {
          DEFAULT: "#1d7488",
          hover: "#29b7cd",
        },
        black: {
          DEFAULT: "#111214",
          100: "#4B5057",
          200: "#F0F0F0",
        },
        gray: {
          100: "#F5F6F7",
          200: "#222529",
          300: "#6E757C",
          400: "#AFB5BC",
          500: "#A4AAB0",
          600: "#F8F9FA",
          700: "#DFE2E6",
          800: "#EAECEF",
          900: "#CFD4DA",
        },
        violet: {
          DEFAULT: "#9E39FF",
          100: "#6726AB",
          200: "#481C78",
          300: "#F5EDFF",
          400: "#9735ff",
          500: "#E5CDFF",
          600: "#CF8CFF",
          700: "#7D02FF",
          800: "#460788",
        },
        green: {
          DEFAULT: "#38BA4E",
          100: "#38BA4E",
        },
        red: {
          DEFAULT: "#DC3545",
          100: "#FFE8EA",
          200: "#ff4d4f",
          300: "#F7BCC2",
          400: "#fff2f0",
        },
        blue: {
          DEFAULT: "#0D6EFD",
          100: "#B7B8BA",
          500: "#E2EEFF",
        },
        orange: {
          DEFAULT: "#FD7E14",
          100: "#FFC1071A",
          200: "#FFC107",
        },
        white: {
          DEFAULT: "#FFFFFF",
          20: "rgba(255, 255, 255, 0.20)",
        },
      },
      spacing: {
        "1px": "1px",
        "2px": "2px",
        "3px": "3px",
        "6px": "6px",
        "18px": "18px",
        "26px": "26px",
      },
      lineHeight: {
        "15": "15px",
        "18": "18px",
      },
      backgroundImage: {
        "yellow-gradient":
          "linear-gradient(87deg, #FF6B39 -6.91%, #FFD000 108.3%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
