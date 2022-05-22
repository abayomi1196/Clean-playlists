const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    // extending default tailwind classes with custom
    extend: {
      fontFamily: {
        serif: ["Ubuntu", ...defaultTheme.fontFamily.serif]
      }
    }
  },
  variants: {
    extend: {}
  }
};
