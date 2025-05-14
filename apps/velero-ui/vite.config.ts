import fs from 'fs';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(async () => {
  if (process.env.TAURI) {
    const tauriConfig = await import('./vite.tauri.config')
    return tauriConfig.default
  }

  return {
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
    },

    plugins: [vue(), nxViteTsPaths()],

    build: {
      outDir: '../../dist/apps/velero-ui/static',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  }
});
