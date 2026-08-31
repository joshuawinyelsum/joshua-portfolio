/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#D9DDE2',
          light: '#F5F6F7',
          white: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#111111',
          soft: '#4A4A4A',
          muted: '#7A7A7A',
        },
        accent: {
          DEFAULT: '#2563EB',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          deeper: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};

