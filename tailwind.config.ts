import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cargo: {
          950: "#070c18",
          900: "#0b132b",
          800: "#1c2541",
          700: "#2d3a5a",
          600: "#3a4d75",
          500: "#4f6594",
          100: "#e8edf5",
          50: "#f4f7fb",
        },
        freight: {
          amber: "#f59e0b",
          amberHover: "#d97706",
          amberDark: "#b45309",
          gold: "#eab308",
        },
        qc: {
          emerald: "#10b981",
          emeraldDark: "#059669",
          emeraldLight: "#d1fae5",
        },
        transit: {
          air: "#0284c7",
          sea: "#4338ca",
        }
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
      },
      screens: {
        xs: "480px",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.05)',
        'cargo': '0 4px 20px -2px rgba(11, 19, 43, 0.08), 0 2px 6px -1px rgba(11, 19, 43, 0.04)',
        'cargo-lg': '0 10px 30px -4px rgba(11, 19, 43, 0.12), 0 4px 12px -2px rgba(11, 19, 43, 0.06)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
};
export default config;
