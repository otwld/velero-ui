const { createGlobPatternsForDependencies } = require('@nx/vue/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
    join(__dirname, 'index.html'),
    join(__dirname, 'src/**/*!(*.stories|*.spec).{vue,ts,tsx,js,jsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'media',
  theme: {
    extend: {
      keyframes: {
        'pulse-loading': {
          '0%': { opacity: 1 },
          '100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        'pulse-loading':
          'pulse-loading 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
  ],
};
