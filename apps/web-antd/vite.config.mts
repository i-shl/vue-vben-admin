import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 代理目标地址
            // target: 'http://localhost:5320/api',
            target: 'http://admin.cw.net/api',
            ws: true,
          },
        },
      },
    },
  };
});
