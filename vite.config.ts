import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
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
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Prevent environment variables from being directly embedded in the build
    'process.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLIC_KEY),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
});
