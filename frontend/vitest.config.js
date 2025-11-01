import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
      exclude: ['build/**', 'android/**', 'ios/**', 'coverage/**', 'node_modules/**', '.eslintrc.js', 'capacitor.config.ts', 'vite.config.js', 'vitest.config.js'],
    },
  },
});
