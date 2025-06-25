// vite.config.js
import { defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      allowedHosts: [env.VITE_BASE_URL]
    },
    define: {
      'process.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL),
      'process.env.VITE_LLM_PORT': JSON.stringify(env.VITE_LLM_PORT),
    },
  };
});

