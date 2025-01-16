import type { App } from 'vue';

import { store } from '@velero-ui-app/plugins/pinia.plugin';
import router from '@velero-ui-app/plugins/router.plugin';
import { Axios } from '@velero-ui-app/plugins/axios.plugin';
import VueApexCharts from 'vue3-apexcharts';
import { defaultConfig, plugin } from '@formkit/vue';
import { SocketIO } from '@velero-ui-app/plugins/socket.plugin';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { i18n } from '@velero-ui-app/plugins/i18n.plugin';

export const registerPlugins = (app: App): void => {
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.use(VueApexCharts);
  app.use(VueQueryPlugin);
  app.use(plugin, defaultConfig);
  app.use(SocketIO);
  app.use(Axios);
};
