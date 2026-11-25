/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07131F',
          900: '#0A1C2E',
          800: '#0F2942',
          700: '#163B5F',
          600: '#1F4F7E',
          500: '#2A68A3',
          100: '#E6EFF7',
          50: '#F0F6FA',
        },
        gold: {
          700: '#A17316',
          600: '#B8841B',
          500: '#D49B24',
          400: '#E4B653',
          300: '#F0D189',
          100: '#FDF6E7',
          50: '#FFFDF9',
        },
        gov: {
          surface: '#F8FAFC',
          border: '#E2E8F0',
          dark: '#0F2942'
        }
      },
    },
  },
  plugins: [],
}
