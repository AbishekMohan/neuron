import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) { if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) return 'three-ecosystem'; if (id.includes('framer-motion')) return 'framer'; },
      },
    },
  },
});

