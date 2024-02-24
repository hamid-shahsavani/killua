/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '1rem',
        lg: '1rem',
        xl: '1rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
  },
  plugins: [],
}

