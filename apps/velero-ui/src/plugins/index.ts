import type { App } from 'vue';

import { store } from './pinia.plugin';
import router from './router.plugin';
import {registerOidcClient} from "./oidc.plugin";
import {registerAxios} from "./axios.plugin";


export const registerPlugins = (app: App): void => {
  app.use(store);
  app.use(router);
  registerAxios(app, store);
  registerOidcClient(app);
};
