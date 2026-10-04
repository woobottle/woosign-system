import {defineConfig} from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname),
  base: '/woosign/',
  resolve: {
    alias: {
      'woosign-system': path.resolve(__dirname, '../src/index.ts'),
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  esbuild: {jsx: 'automatic'},
  build: {outDir: 'dist', emptyOutDir: true},
  server: {host: '127.0.0.1', port: 5173},
});
