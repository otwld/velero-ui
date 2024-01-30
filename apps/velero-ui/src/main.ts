import './assets/styles/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';

const app = createApp(App);

registerPlugins(app);

app.mount('#root');
