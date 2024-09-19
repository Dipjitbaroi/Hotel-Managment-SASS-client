/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        green: {
          slimy: "#37a000",
        },
      },
      fontFamily: {
        josefinSans: ["Josefin Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  daisyui: {
    themes: ["cupcake"],
  },
};
