import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';
import { readFileSync } from 'node:fs';

const host = process.env.TAURI_DEV_HOST;

console.log(host)
console.log(__dirname)

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/velero-ui-desktop',
  clearScreen: false,

  server: {
    port: parseInt(process.env.VITE_PORT),
    strictPort: true,
    host: host || false,
    fs: {
      strict: false,
    },
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: parseInt(process.env.VITE_PORT),
        }
      : undefined,
  },

  envPrefix: ['VITE_', 'TAURI_'],

  resolve: {
    alias: [
      {
        find: '@velero-ui-app',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },

  define: {
    'import.meta.env.TAURI': true,
    'import.meta.env.APP_VERSION': `"${
      JSON.parse(readFileSync(join(__dirname, '../../package.json')).toString())
        .version
    }"`,
  },

  plugins: [vue(), nxViteTsPaths()],

  build: {
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    outDir: '../../dist/apps/velero-ui-desktop',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
