import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist/client', // Output the SPA build here
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "agenticxp.127.0.0.1.nip.io",
      "agenticxp-stg.internal.huna2.com",
      "localhost",
      "127.0.0.1",
      "agenticxp"
    ],
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/swagger': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});