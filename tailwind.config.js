/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        scripture: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#132d52',
          dark: '#071528',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#e8b82a',
          dark: '#b88912',
        },
        surface: '#FAF8F3',
        charcoal: '#1C1C1C',
        live: '#E63946',
        primary: {
          50: '#f4f2ed',
          100: '#e8e4db',
          200: '#d4cbb8',
          300: '#b8a98a',
          400: '#9a8868',
          500: '#7d6d4f',
          600: '#5c5240',
          700: '#3d3a32',
          800: '#1f2a3d',
          900: '#0B1F3A',
          950: '#071528',
        },
        accent: {
          50: '#fdf8e8',
          100: '#f9edc4',
          200: '#f2d98a',
          300: '#e8b82a',
          400: '#D4A017',
          500: '#b88912',
          600: '#946d0e',
          700: '#6f520a',
          800: '#4a3707',
          900: '#251b03',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
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
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(180deg, rgba(11,31,58,0.85) 0%, rgba(11,31,58,0.95) 100%)',
        'gradient-overlay-dark': 'linear-gradient(180deg, rgba(11,31,58,0.4) 0%, rgba(11,31,58,0.75) 100%)',
      },
    },
  },
  plugins: [],
}
