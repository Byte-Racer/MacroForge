import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        card: "#101010",
        line: "#2b2b2b",
        frost: "#f2efe8",
        protein: "#9fd7c9",
        calorie: "#dfc88c",
        coral: "#e99890",
        water: "#95b9df",
        muted: "#a9a39b",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        brand: ["Cinzel", "serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 32px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [forms],
};