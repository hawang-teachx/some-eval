/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        income: {
          primary: "#10b981",
          light: "#d1fae5",
          dark: "#065f46",
        },
        expense: {
          primary: "#ef4444",
          light: "#fee2e2",
          dark: "#991b1b",
        },
      },
    },
  },
  plugins: [],
};
