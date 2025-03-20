import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    allowedHosts: ["sync41-ui.onrender.com"],
  },
  server: {
    proxy: {
      // Existing /auth proxy
      '/auth': {
        target: 'http://ec2-3-91-217-18.compute-1.amazonaws.com:8000',
        changeOrigin: true,
        secure: false,
      },
      // New /tenant proxy
      '/tenant': {
        target: 'http://ec2-3-91-217-18.compute-1.amazonaws.com:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
