/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      extend: {
          fontFamily: {
              inter: ["Inter", "sans-serif"],
              lexend: ["Lexend", "sans-serif"],
              poppins: ["Poppins", "sans-serif"],
              roadRage: ["Road Rage", "cursive"],
              roboto: ["Roboto", "sans-serif"],
              sourceSerif: ["Source Serif 4", "serif"],
              jeju: ["Jeju Myeongjo", "serif"],
              alatsi: ["Alatsi", "serif"],
            },
      },
  },
  plugins: [],
};
