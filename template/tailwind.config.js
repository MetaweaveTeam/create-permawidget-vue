/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mtw_purple: "#f817b5",
        mtw_white_alt: "#f9f9f9",
        mtw_white_alt2: "#f3f4ff",
      },
    },
  },
  plugins: [require("daisyui")],
};
