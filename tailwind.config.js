/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Maiandra GD', 'Nunito', 'system-ui', 'sans-serif'],
        scripture: ['Maiandra GD', 'Nunito', 'system-ui', 'sans-serif'],
        maiandra: ['Maiandra GD', 'Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#1B2F9B',
          light: '#2A45B8',
          dark: '#121F6E',
        },
        gold: {
          DEFAULT: '#C8102E',
          light: '#E63946',
          dark: '#9E0C24',
        },
        brand: {
          red: '#C8102E',
          green: '#1B7A3D',
          blue: '#1B2F9B',
        },
        surface: '#F5F7FC',
        charcoal: '#141414',
        live: '#C8102E',
        primary: {
          50: '#eef1fb',
          100: '#d9dff5',
          200: '#b3c0eb',
          300: '#8ca0e0',
          400: '#4d66c9',
          500: '#1B2F9B',
          600: '#172887',
          700: '#121F6E',
          800: '#0e1855',
          900: '#0a1140',
          950: '#060a28',
        },
        accent: {
          50: '#fce8eb',
          100: '#f7c5cc',
          200: '#ef8f9c',
          300: '#E63946',
          400: '#C8102E',
          500: '#9E0C24',
          600: '#7a091c',
          700: '#570714',
          800: '#3a040d',
          900: '#1f0207',
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
        'gradient-navy': 'linear-gradient(180deg, rgba(27,47,155,0.85) 0%, rgba(18,31,110,0.95) 100%)',
        'gradient-overlay-dark': 'linear-gradient(180deg, rgba(27,47,155,0.4) 0%, rgba(18,31,110,0.8) 100%)',
      },
    },
  },
  plugins: [],
}
