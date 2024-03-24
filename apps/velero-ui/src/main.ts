import './assets/styles/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';
import { registerConfig } from '@velero-ui-app/utils/config.utils';

const app = createApp(App);

registerConfig(app).then((): void => {
  registerPlugins(app);
  app.mount('#root');
}).catch((): void => {
  console.error('Cannot initialize application, is the server online?')
});
