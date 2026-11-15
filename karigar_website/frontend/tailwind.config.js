/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102747',
          dark: '#0A1930',
          deep: '#06101E',
          light: '#1B355A',
        },
        primary: {
          DEFAULT: '#102747',
          dark: '#0A1930',
          light: '#1B355A',
        },
        orange: {
          DEFAULT: '#FF8A00',
          hover: '#E67A00',
          light: '#FFF4E6',
        },
        secondary: {
          DEFAULT: '#FF8A00',
          dark: '#E67A00',
          light: '#FFA333',
        },
        surface: {
          white: '#FFFFFF',
          light: '#F8FAFC',
          muted: '#F1F5F9',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(10, 25, 48, 0.05)',
        'card': '0 8px 30px rgba(10, 25, 48, 0.08)',
        'card-hover': '0 16px 36px rgba(10, 25, 48, 0.12)',
        'glow-orange': '0 6px 20px rgba(255, 138, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
