import type { App } from 'vue';

import { store } from '@velero-ui-app/plugins/pinia.plugin';
import router from '@velero-ui-app/plugins/router.plugin';
import { registerAxios } from '@velero-ui-app/plugins/axios.plugin';
import VueApexCharts from 'vue3-apexcharts';
import { defaultConfig, plugin } from '@formkit/vue';
import { registerSocketIo } from '@velero-ui-app/plugins/socket.plugin';
import { VueQueryPlugin } from '@tanstack/vue-query';

export const registerPlugins = (app: App): void => {
  app.use(store);
  app.use(router);
  app.use(VueApexCharts);
  app.use(VueQueryPlugin);
  app.use(plugin, defaultConfig);
  registerAxios(app, store);
  registerSocketIo(app);
};
