// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // <<<=== ตรวจสอบ/เพิ่มบรรทัดนี้
  theme: {
    extend: {
      // ... theme อื่นๆ
    },
  },
  plugins: [],
};
export default config;