import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'buildINFO/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    cssCodeSplit: true,
    outDir: 'build',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            const parts = id.toString().split('node_modules/')[1].split('/');
            const name = parts[0].startsWith('@')
              ? `${parts[0]}/${parts[1]}`
              : parts[0];
            return name;
          }
          if (id.endsWith('.css')) {
            return 'styles';
          }
        },
      },
    },
  },
  server: { host: '0.0.0.0', port: 3000 },
  preview: { host: '0.0.0.0', port: 3000 },
});
