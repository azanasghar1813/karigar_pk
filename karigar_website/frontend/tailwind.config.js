/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#0F1E3D',
            dark: '#0A1428',
            light: '#1B2C52',
          },
          secondary: {
            DEFAULT: '#FF6B00',
            dark: '#E05D00',
            light: '#FF8533',
          },
          accent: '#FF782D',
          darkBg: '#0B1329',
          darkCard: '#131F3D',
          darkBorder: '#1F2E54',
          background: '#0B1329',
          'dark-text': '#F1F5F9',
          success: '#10B981',
        },
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
        },
        boxShadow: {
          'glow-orange': '0 0 25px rgba(255, 107, 0, 0.35)',
          'card-dark': '0 10px 30px -5px rgba(2, 6, 23, 0.6)',
        }
      },
    },
    plugins: [],
  }