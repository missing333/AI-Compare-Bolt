import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      sourcemap: true,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
      host: true,
      allowedHosts: [
        'localhost',
        '.vercel.app'
      ],
    },
    define: {
      __STRIPE_PUBLIC_KEY__: JSON.stringify(env.VITE_STRIPE_PUBLIC_KEY || ''),
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'http://localhost:3000'),
    },
  };
});
