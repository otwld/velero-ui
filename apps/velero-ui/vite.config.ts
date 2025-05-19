import fs from 'fs';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as process from 'node:process';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/velero-ui',

  server: {
    port: parseInt(process.env.VITE_PORT),
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  resolve: {
    alias: [
      {
        find: '@velero-ui-app',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },

  define: {
    'import.meta.env.APP_VERSION': `"${
      JSON.parse(fs.readFileSync('./package.json').toString()).version
    }"`,
    'import.meta.env.DEFAULT_LANGUAGE': `"${
      process.env['DEFAULT_LANGUAGE'] || 'en'
    }"`,
    'import.meta.env.DEFAULT_TIMEZONE': `"${
      process.env['DEFAULT_TIMEZONE'] || 'Europe/London'
    }"`,
  },

  plugins: [vue(), nxViteTsPaths()],

  build: {
    outDir: '../../dist/apps/velero-ui/static',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/velero-ui',
      provider: 'v8',
    },
  },
});
