/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        dotgothic: ['DotGothic16_400Regular'],
      },
    },
  },
  plugins: [],
};
