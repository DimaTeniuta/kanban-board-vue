import 'vue3-toastify/dist/index.css';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import Vue3Toastify from 'vue3-toastify';

import App from 'app/App.vue';
import { router } from 'app/router';
import { vuetify } from 'app/theme';
import { queryClient } from 'shared/api';

const app = createApp(App);
const pinia = createPinia();

app.use(vuetify);

app.use(router);

app.use(pinia);
pinia.use(piniaPluginPersistedstate);

app.use(VueQueryPlugin, { queryClient, enableDevtoolsV6Plugin: true });

app.use(Vue3Toastify, {
  autoClose: 3_000,
  position: 'top-right',
  theme: 'colored',
  limit: 5
});

app.mount('#app');
