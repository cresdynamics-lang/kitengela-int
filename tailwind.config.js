/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f1f4f8',
          100: '#e0e8f0',
          200: '#c5d5e3',
          300: '#9dbcd1',
          400: '#6f9abb',
          500: '#4e7ca1',
          600: '#3a6184',
          700: '#2f4f6e',
          800: '#29435c',
          900: '#0f1e35', // Deep Navy
        },
        accent: {
          50: '#fbf8eb',
          100: '#f5efcc',
          200: '#eddf9b',
          300: '#e3ca63',
          400: '#dab336',
          500: '#c9972f', // Soft Gold
          600: '#ab7722',
          700: '#89581e',
          800: '#71461f',
          900: '#5f3a1d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-to-br-dark': 'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
        'gradient-overlay-dark': 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
      },
    },
  },
  plugins: [],
}
