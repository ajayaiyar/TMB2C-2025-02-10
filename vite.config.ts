import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    watch: {
      // Don't watch node_modules and environment files
      ignored: ['**/node_modules/**', '**/.env*']
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});