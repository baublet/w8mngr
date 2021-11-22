const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./client/**/*.ts", "./client/**/*.tsx"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      background: "#060D12",
      backgroundText: "#FFF",
      primary: "#83B638",
      primaryText: colors.white,
      primaryLight: "#B3D77D",
      primaryLightText: colors.black,
      secondary: "#3883B6",
      secondaryText: colors.white,
      secondaryLight: "#7DB3D7",
      secondaryLightText: colors.black,
      foreground: colors.white,
      primaryText: colors.black,
    },
    extend: {},
  },
  variants: {},
  plugins: [],
};
