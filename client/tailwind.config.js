/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0c0c0d",
        panel: "#151518",
        text: "#e2e2e2",
        neon: "#39ff14",
        border: "#2a2a2d",
        danger: "#ff4d4d",
      },
      boxShadow: {
        neon: "0 0 8px #39ff14, 0 0 20px #39ff14",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
