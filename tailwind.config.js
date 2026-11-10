/** @type {import('tailwindcss').Config} */

// Every value here points at a custom property defined in src/styles/tokens.css.
// Change the token, not this file.
const channel = (name) => `rgb(var(--rgb-${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Mirrors --breakpoint-* in tokens.css.
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        canvas: channel('canvas'),
        surface: channel('surface'),
        sunken: channel('sunken'),
        inverse: channel('inverse'),
        'on-inverse': {
          DEFAULT: channel('on-inverse'),
          muted: channel('on-inverse-muted'),
        },
        ink: {
          DEFAULT: channel('ink'),
          soft: channel('ink-soft'),
          muted: channel('ink-muted'),
        },
        line: channel('line'),
        lavender: channel('lavender'),
        cream: {
          DEFAULT: channel('cream'),
          soft: channel('cream-soft'),
        },
        onyx: channel('onyx'),
        accent: {
          DEFAULT: channel('accent'),
          soft: channel('accent-soft'),
        },
        positive: channel('positive'),
        danger: channel('danger'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        headline: ['var(--text-headline)', { lineHeight: 'var(--leading-headline)', letterSpacing: 'var(--tracking-headline)' }],
        'title-lg': ['var(--text-title-lg)', { lineHeight: 'var(--leading-headline)', letterSpacing: 'var(--tracking-headline)' }],
        title: ['var(--text-title)', { lineHeight: 'var(--leading-title)', letterSpacing: 'var(--tracking-title)' }],
        lead: ['var(--text-lead)', { lineHeight: 'var(--leading-body)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        small: ['var(--text-small)', { lineHeight: 'var(--leading-small)' }],
        caption: ['var(--text-caption)', { lineHeight: 'var(--leading-small)' }],
        eyebrow: ['var(--text-eyebrow)', { lineHeight: '1.2', letterSpacing: 'var(--tracking-eyebrow)' }],
      },
      spacing: {
        section: 'var(--space-section)',
        gutter: 'var(--space-gutter)',
        card: 'var(--space-card)',
        grid: 'var(--space-grid)',
      },
      maxWidth: {
        content: 'var(--width-content)',
      },
      borderRadius: {
        chip: 'var(--radius-chip)',
        control: 'var(--radius-control)',
        frame: 'var(--radius-frame)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        face: 'var(--shadow-face)',
        'face-hover': 'var(--shadow-face-hover)',
        frame: 'var(--shadow-frame)',
        nav: 'var(--shadow-nav)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
