import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// 配置Vite
export default defineConfig({
  plugins: [vue()],
  root: path.resolve(__dirname),
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  build: {
    outDir: '../../dist-only-vue/ui',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },

});
