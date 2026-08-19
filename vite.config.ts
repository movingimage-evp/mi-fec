/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Bridges the CRA-era `process.env.REACT_APP_*` reads that the service layer
  // still relies on. Vite exposes them via `define` at build time.
  define: {
    'process.env.REACT_APP_API': JSON.stringify(process.env.REACT_APP_API ?? 'http://localhost:3001'),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
