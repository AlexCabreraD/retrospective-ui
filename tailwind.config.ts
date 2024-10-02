import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { green: "#47aa6a" },
      fontSize: {
        // Large Desktop Sizes
        "h1-lg": ["48px", { lineHeight: "56px", fontWeight: "700" }], // H1
        "h2-lg": ["36px", { lineHeight: "44px", fontWeight: "700" }], // H2
        "h3-lg": ["30px", { lineHeight: "38px", fontWeight: "700" }], // H3
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }], // Body
        "small-lg": ["14px", { lineHeight: "20px", fontWeight: "400" }], // Small Text
        "caption-lg": ["12px", { lineHeight: "16px", fontWeight: "400" }], // Caption
        "button-lg": ["16px", { lineHeight: "24px", fontWeight: "500" }], // Button Text

        // Desktop Sizes
        h1: ["40px", { lineHeight: "48px", fontWeight: "700" }], // H1
        h2: ["30px", { lineHeight: "38px", fontWeight: "700" }], // H2
        h3: ["24px", { lineHeight: "32px", fontWeight: "700" }], // H3
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }], // Body
        small: ["12px", { lineHeight: "16px", fontWeight: "400" }], // Small Text
        caption: ["10px", { lineHeight: "14px", fontWeight: "400" }], // Caption
        button: ["14px", { lineHeight: "20px", fontWeight: "500" }], // Button Text

        // Mobile Sizes
        "h1-sm": ["32px", { lineHeight: "40px", fontWeight: "700" }], // H1
        "h2-sm": ["24px", { lineHeight: "32px", fontWeight: "700" }], // H2
        "h3-sm": ["20px", { lineHeight: "28px", fontWeight: "700" }], // H3
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }], // Body
        "small-sm": ["10px", { lineHeight: "14px", fontWeight: "400" }], // Small Text
        "caption-sm": ["8px", { lineHeight: "12px", fontWeight: "400" }], // Caption
        "button-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }], // Button Text
      },
    },
  },
  plugins: [],
};
export default config;
