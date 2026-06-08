/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4300',
          50: 'rgba(255, 67, 0, 0.05)',
          100: 'rgba(255, 67, 0, 0.1)',
          200: 'rgba(255, 67, 0, 0.2)',
          300: 'rgba(255, 67, 0, 0.3)',
          400: 'rgba(255, 67, 0, 0.4)',
          500: 'rgba(255, 67, 0, 0.5)',
          600: 'rgba(255, 67, 0, 0.6)',
          700: 'rgba(255, 67, 0, 0.7)',
          800: 'rgba(255, 67, 0, 0.8)',
          900: 'rgba(255, 67, 0, 0.9)',
        },
        secondary: {
          black: '#000',
          white: '#fff',
        },
      },
    },
  },
  plugins: [],
}