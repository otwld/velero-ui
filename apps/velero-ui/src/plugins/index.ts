import type { App } from 'vue';

import { store } from '@velero-ui-app/plugins/pinia.plugin';
import router from '@velero-ui-app/plugins/router.plugin';
import { registerOidcClient } from '@velero-ui-app/plugins/oidc.plugin';
import { registerAxios } from '@velero-ui-app/plugins/axios.plugin';
import VueApexCharts from 'vue3-apexcharts';

export const registerPlugins = (app: App): void => {
  app.use(store);
  app.use(router);
  app.use(VueApexCharts);
  registerAxios(app, store);
  registerOidcClient(app);
};
