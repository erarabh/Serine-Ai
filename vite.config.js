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
    headers: {
      "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://serine-ai-backend-production.up.railway.app;",
    }
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify("https://serine-ai-backend-production.up.railway.app"),
	"process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },		   
});

