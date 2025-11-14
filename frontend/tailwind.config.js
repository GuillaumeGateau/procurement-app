const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1F2933",
        ocean: "#1C6DD0",
        teal: "#0D9488",
        cream: "#FDF8F5",
        slate: "#2F3A46",
        accent: "#65BC7B",
      },
      fontFamily: {
        sans: ["'Barlow'", ...defaultTheme.fontFamily.sans],
        heading: ["'Playfair Display'", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};

