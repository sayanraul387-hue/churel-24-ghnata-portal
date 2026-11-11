
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/churel-24-ghnata-portal/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        website: resolve(process.cwd(), 'website.html'),
        admin: resolve(process.cwd(), 'admin.html')
      }
    }
  }
});
