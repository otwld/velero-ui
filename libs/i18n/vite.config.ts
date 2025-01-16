import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/i18n',

  plugins: [vue(), nxViteTsPaths()],

  build: {
    outDir: '../../dist/libs/i18n/static',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: './src/index.ts',
      formats: ['cjs'],
    },
  },
});
