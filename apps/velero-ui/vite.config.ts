import fs from 'fs';
import { fileURLToPath, URL } from 'url';
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

  resolve: {
    alias: [
      {
        find: '@assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
      {
        find: '@api',
        replacement: fileURLToPath(new URL('./src/api', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
      },
      {
        find: '@use',
        replacement: fileURLToPath(new URL('./src/use', import.meta.url)),
      },
      {
        find: '@layouts',
        replacement: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      },
      {
        find: '@stores',
        replacement: fileURLToPath(new URL('./src/stores', import.meta.url)),
      },
      {
        find: '@plugins',
        replacement: fileURLToPath(new URL('./src/plugins', import.meta.url)),
      },
      {
        find: '@views',
        replacement: fileURLToPath(new URL('./src/views', import.meta.url)),
      },
      {
        find: '@utils',
        replacement: fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    ],
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
  },
});
