const { createGlobPatternsForDependencies } = require('@nx/vue/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    join(__dirname, 'index.html'),
    join(__dirname, 'src/**/*!(*.stories|*.spec).{vue,ts,tsx,js,jsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};
