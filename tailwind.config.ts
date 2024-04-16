import colors from "tailwindcss/colors";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.slate[900],
        secondaryHighlight: colors.slate[700],
        highlight: colors.indigo[500],
        lowlight: colors.slate[400],
        current: colors.white,
      },
    },
  },
  plugins: [],
};
export default config;
