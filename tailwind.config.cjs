/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xxs: '320px',
        xs: '480px',
      },
      colors: {
        app: {
          background: '#2B2B2B',
          backgroundLight: '#393939',
          primary: '#0061b3',
          primaryLight: '#46aaff',

          text: '#d2d2d2',
          title: '#f5f5f5',

          label: '#999999',
          border: '#999999',
          placeholder: '#999999',

          info: '#46aaff',
          success: '#1EB980',
          warning: '#FFAC12',
          error: '#B3261E',
        },
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        23: '5.75rem',
        26: '6.5rem',
        27: '6.75rem',
        30: '7.5rem',
        31: '7.75rem',
        50: '12.5rem',
        54: '13.5rem',
        55: '13.75rem',
        96: '24rem',
        256: '64rem',
        320: '80rem',
        360: '90rem',
      },
      brightness: {
        25: '.25',
        85: '.85',
      },
      boxShadow: {
        outline: '0 0 0 1px',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
        mono: [
          'Roboto Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '1rem' }],
        13: ['0.812rem', { lineHeight: '1.25rem' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        '8xl': ['8rem', { lineHeight: '1' }],
        '9xl': ['11.25rem', { lineHeight: '1' }],
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        fit56: 'repeat(auto-fit, minmax(3.5rem, 1fr))',
        fit200: 'repeat(auto-fit, minmax(12.5rem, 1fr))',
        fit232: 'repeat(auto-fit, minmax(14.5rem, 1fr))',
      },
      zIndex: {
        9999: '9999',
      },
      backgroundImage: {
        'bg-pattern': "url('/bgPattern.svg')",
        'stats-card': "url('/StatsCardBg.svg')",
      },
      backgroundSize: {
        16: '6px 6px',
      },
      opacity: {
        85: '.85',
      },
    },
  },
}
