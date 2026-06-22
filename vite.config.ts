import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vuePlugin from '@vitejs/plugin-vue';
import vuetifyPlugin from 'vite-plugin-vuetify';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import vueDevToolsPlugin from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => ({
  plugins: [
    vuePlugin(),
    vuetifyPlugin({ autoImport: true }),
    vueJsxPlugin(),
    mode === 'development' && vueDevToolsPlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      app: fileURLToPath(new URL('./src/app', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      widgets: fileURLToPath(new URL('./src/widgets', import.meta.url)),
      features: fileURLToPath(new URL('./src/features', import.meta.url)),
      entities: fileURLToPath(new URL('./src/entities', import.meta.url)),
      shared: fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue', '.ts', '.js', '.jsx', '.tsx']
  },
  server: {
    port: 3000,
    open: true
  }
}));
