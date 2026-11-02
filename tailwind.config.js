/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#D9DDE2',
          light: '#F5F6F7',
          white: '#FFFFFF',
          dark: '#121316',
          darkSurface: '#18191e',
          darkCard: '#1c1e24',
          darkElevated: '#22252c',
          darkBorder: '#282a32',
        },
        primary: {
          DEFAULT: '#111111',
          soft: '#4A4A4A',
          muted: '#7A7A7A',
          darkText: '#ededeb',
          darkMuted: '#9ca3af',
        },
        accent: {
          DEFAULT: '#2563EB',
          dark: '#3b82f6',
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
