import './assets/styles/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';
import { registerConfig } from '@velero-ui-app/utils/config.utils';
import { registerDirectives } from '@velero-ui-app/utils/directive.utils';

const app = createApp(App);
const version: string = import.meta.env.APP_VERSION;
const environment: string = import.meta.env.MODE;

registerDirectives(app);
registerConfig(app)
  .then((): void => {
    registerPlugins(app);
    app.mount('#root');
    console.info(
      `=> Velero UI v${version} - ${environment} - Powered by OTWLD`,
    );
  })
  .catch((): void => {
    console.error('Cannot initialize application, is the server online?');
  });
