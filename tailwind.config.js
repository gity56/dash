/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          100: '#ffedb3',
          200: '#ffe180',
          300: '#ffd54d',
          400: '#ffc91a',
          500: '#e6b300',
          600: '#b38900',
          700: '#805f00',
          800: '#4d3900',
          900: '#1a1300',
        },
        dark: {
          100: '#1a1625',
          200: '#15121e',
          300: '#100e17',
          400: '#0b0a10',
          500: '#060509',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        arabic: ['Noto Kufi Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};