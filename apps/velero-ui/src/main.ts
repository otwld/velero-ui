import './assets/styles/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';
import { registerConfig } from '@velero-ui-app/utils/config.utils';
import { registerDirectives } from '@velero-ui-app/utils/directive.utils';

const app = createApp(App);
const version: string = import.meta.env.APP_VERSION;
const environment: string = import.meta.env.MODE;

console.log(import.meta.env)

registerDirectives(app);
const RETRY_DELAY = 2000;

function startApp(): void {
  registerConfig(app)
    .then(() => {
      registerPlugins(app);
      app.mount('#root');
      console.info(
        `=> Velero UI v${version} - ${environment} - Powered by OTWLD`,
      );
    })
    .catch(() => {
        console.warn(
          `Cannot initialize app, retrying in ${RETRY_DELAY / 1000}s...)`,
        );
        setTimeout(() => startApp(), RETRY_DELAY);
    });
}

startApp();
