/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935',
          dark: '#C62828',
          light: '#EF5350',
          50: '#FDECEA',
          100: '#F9D0CE',
          200: '#F5A3A0',
          500: '#E53935',
          600: '#C62828',
          700: '#B71C1C',
        },
        background: '#FAFAFA',
        card: '#FFFFFF',
        text: {
          primary: '#111111',
          secondary: '#666666',
          muted: '#999999',
        },
        teal: {
          DEFAULT: '#00897B',
          dark: '#00695C',
          light: '#4DB6AC',
        },
        dark: {
          DEFAULT: '#3E2723',
          light: '#4E342E',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['Inter'],
        bold: ['Inter-Bold'],
        medium: ['Inter-Medium'],
        semibold: ['Inter-SemiBold'],
      },
    },
  },
  plugins: [],
};
