import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./packages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% neutral surfaces and text derived from the logo grayscale foundation.
        surface: {
          DEFAULT: "#fdfdfb",
          alt: "#ffffff",
          muted: "#f2f4f8",
          border: "#d7dce5",
          foreground: "#1f2937",
          "muted-foreground": "#4b5563",
        },
        // 30% primary blue anchored in the Pleione wordmark accents.
        primary: {
          DEFAULT: "#1d4ed8",
          dark: "#1e3a8a",
          soft: "#dbeafe",
        },
        // 10% accent applied to calls to action and highlights.
        accent: {
          DEFAULT: "#ec4899",
          dark: "#be185d",
          soft: "#fce7f3",
        },
        feedback: {
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          "danger-soft": "rgba(239, 68, 68, 0.16)",
        },
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.75rem",
        lg: "1rem",
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      boxShadow: {
        soft: "0px 10px 30px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
