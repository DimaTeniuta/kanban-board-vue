import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#4F46E5',
          secondary: '#64748B',
          accent: '#0D9488',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#22C55E',
          warning: '#F59E0B',
          background: '#F1F5F9',
          surface: '#FFFFFF'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#A78BFA',
          secondary: '#7C3AED',
          accent: '#22D3EE',
          error: '#F87171',
          info: '#60A5FA',
          success: '#4ADE80',
          warning: '#FBBF24',
          background: '#0C0A14',
          surface: '#16122A'
        }
      }
    }
  }
});
