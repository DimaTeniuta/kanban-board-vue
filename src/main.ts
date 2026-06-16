import { createApp } from 'vue';

import App from 'app/App.vue';
import { router } from 'app/router';
import { vuetify } from 'app/theme';

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.mount('#app');
