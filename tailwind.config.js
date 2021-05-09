const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  plugins: [require("@tailwindcss/typography")],
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      black: colors.black,
      gray: colors.gray,
      green: colors.green,
      red: colors.red,
      white: colors.white,
    },
  },
  variants: {
    extend: {},
  },
};
