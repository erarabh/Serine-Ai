// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat': {
        target: 'https://serine-ai-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
