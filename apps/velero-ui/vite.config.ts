/// <reference types='vitest' />
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/velero-ui',

  server: {
    port: process.env.VITE_API_PORT,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  define: {
    'import.meta.env.APP_VERSION': `"${
      JSON.parse(fs.readFileSync('./package.json').toString()).version
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
  }
});
