/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')
module.exports = {
  darkMode: 'class',
  content: ['./**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter, sans-serif',
      },
      colors: {
        'san-marino': {
          50: '#f4f5fb',
          100: '#e9ebf5',
          200: '#cdd3ea',
          300: '#a2afd7',
          400: '#7084c0',
          500: '#576eb2', //
          600: '#3b4e8e',
          700: '#313f73',
          800: '#2c3760',
          900: '#283052',
        },
        portal: {
          primary: {
            50: '#f3eef1',
            100: '#d9cbd2',
            200: '#c7b2bd',
            300: '#ad8f9f',
            400: '#9d798c',
            500: '#85586f',
            600: '#795065',
            700: '#5e3e4f',
            800: '#49303d',
            900: '#38252f',
          },
          secondary: {
            50: '#faf8f6',
            100: '#f0e9e4',
            200: '#e9ded7',
            300: '#e0cfc5',
            400: '#d9c6b9',
            500: '#d0b8a8',
            600: '#bda799',
            700: '#948377',
            800: '#72655c',
            900: '#574d47',
          },
          tertiary: {
            50: '#fcfbf9',
            100: '#f5f1ec',
            200: '#f0ebe3',
            300: '#eae2d7',
            400: '#e5dccf',
            500: '#dfd3c3',
            600: '#cbc0b1',
            700: '#9e968a',
            800: '#7b746b',
            900: '#5e5952',
          },
        },
      },
      keyframes: {
        slideIn: {
          from: { width: 0 },
          to: { width: 'var(--radix-collapsible-content-width)' },
        },
        slideOut: {
          from: { width: 'var(--radix-collapsible-content-width)' },
          to: { width: 0 },
        },
        moonIn: {
          from: { top: '50%' },
          to: { top: '0%' },
        },
        moonOut: {
          from: { top: '0%' },
          to: { top: '50%' },
        },
        sunIn: {
          from: { top: '50%' },
          to: { top: '0%' },
        },
        sunOut: {
          from: { top: '0%' },
          to: { top: '50%' },
        },

        // slideUp: {
        //   from: {
        //     opacity: 0,
        //     transform: 'translateY(2px)',
        //   },
        //   to: {
        //     opacity: 1,
        //     transform: 'translateY(0)',
        //   },
        // },
        // slideRight: {
        //   from: {
        //     opacity: 0,
        //     transform: 'translateX(-2px)',
        //   },
        //   to: {
        //     opacity: 1,
        //     transform: 'translateX(0)',
        //   },
        // },
        // slideDown: {
        //   from: {
        //     opacity: 0,
        //     transform: 'translateY(-2px)',
        //   },
        //   to: {
        //     opacity: 1,
        //     transform: 'translateY(0)',
        //   },
        // },
        // slideLeft: {
        //   from: {
        //     opacity: 0,
        //     transform: 'translateX(2px)',
        //   },
        //   to: {
        //     opacity: 1,
        //     transform: 'translateX(0)',
        //   },
        // },
      },
      animation: {
        slideIn: 'slideIn 0.25s',
        slideOut: 'slideOut 0.25s',
        moonIn: 'moonIn 1s',
        moonOut: 'moonOut 1s',
        sunIn: 'sunIn 1s',
        sunOut: 'sunOut 1s',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.region-drag': {
          '-webkit-app-region': 'drag',
        },
        '.region-no-drag': {
          '-webkit-app-region': 'no-drag',
        },
        '.outline-primary-color-700': {
          outline: '1px solid #5e3e4f',
          outlineOffset: -1,
        },
        '.outline-secondary-color-700': {
          outline: '1px solid #948377',
          outlineOffset: -1,
        },
        '.toast-login-active': {
          transform: 'translateX(calc(100% + 15px))',
          transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35)',
        },
        '.toast-login-disabled': {
          transform: 'translateX(0px)',
          transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35)',
        },
        '.transparent-white': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(25px)',
        },
        '.display-no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      })
    }),
  ],
}
