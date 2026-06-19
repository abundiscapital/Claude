/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          950: '#05060f',
          900: '#0a0b1a',
          800: '#11132a',
          700: '#1b1e3d',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        fuchsia: {
          400: '#e879f9',
          500: '#d946ef',
        },
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(99, 102, 241, 0.55)',
        card: '0 20px 60px -20px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 12s ease infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
