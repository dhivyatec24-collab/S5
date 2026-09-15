/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FDF2F4",
          rose: "#FDE8ED",
          blush: "#F8D7DE",
          lavender: "#F3EEFA",
          peach: "#FFF1EB",
          cream: "#FAF9F6",
          accent: "#D85A7F",
          accentDark: "#B83B60",
          textPrimary: "#372B2E",
          textSecondary: "#6E5D63",
          border: "#F1D2DB",
          card: "#FFFFFF"
        }
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(216, 90, 127, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 6px 16px -2px rgba(216, 90, 127, 0.08), 0 3px 8px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 12px 28px -4px rgba(216, 90, 127, 0.12), 0 6px 12px -3px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
