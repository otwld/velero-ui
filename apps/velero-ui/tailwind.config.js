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
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  safelist: [
    'h-2',
    'h-2.5',
    'h-3',
    'h-4',
    'h-5',
    'h-6',
    'w-2',
    'w-4',
    'w-8',
    'w-12',
    'w-24',
    'w-32',
    'w-48',
    'w-72',
    'w-96',
    'w-full',
  ],
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
  plugins: [require('flowbite/plugin')],
};
