/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1A3C6E',
          secondary: '#F97316',
          background: '#F8FAFC',
          'dark-text': '#1E293B',
          success: '#22C55E',
        },
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }