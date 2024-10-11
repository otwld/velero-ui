import './assets/styles/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';
import { registerConfig } from '@velero-ui-app/utils/config.utils';

const app = createApp(App);
const version: string = import.meta.env.APP_VERSION;
const environment: string = import.meta.env.MODE;

const clickOutside = {
  mounted: (el, binding) => {
    el.clickOutsideEvent = event => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: el => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

app.directive("clickOut", clickOutside)

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
