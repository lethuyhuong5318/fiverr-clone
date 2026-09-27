/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1DBF73',
          50: '#E7F9F0',
          100: '#C4F0DA',
          500: '#1DBF73',
          600: '#19A564',
          700: '#147A4A',
        },
        ink: {
          DEFAULT: '#222325',
          soft: '#62646A',
          faint: '#95979D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.14)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.7)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'page-in': 'pageIn 0.25s ease-out',
        'pop-in': 'popIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
