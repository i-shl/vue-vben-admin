import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:code',
      order: 1,
      title: '示例',
    },
    name: 'Examples',
    path: '/examples',
    children: [
      {
        name: 'ExampleApiRequest',
        path: 'api-request',
        component: () => import('#/views/examples/api-request/index.vue'),
        meta: {
          icon: 'lucide:network',
          title: '接口请求示例',
        },
      },
      {
        name: 'ExampleCharts',
        path: 'charts',
        component: () => import('#/views/examples/charts/index.vue'),
        meta: {
          icon: 'lucide:chart-bar',
          title: '图表示例',
        },
      },
      {
        name: 'ExampleExport',
        path: 'export',
        component: () => import('#/views/examples/export/index.vue'),
        meta: {
          icon: 'lucide:download',
          title: '导出功能',
        },
      },
      {
        name: 'ExampleDesktopNotification',
        path: 'desktop-notification',
        component: () =>
          import('#/views/examples/desktop-notification/index.vue'),
        meta: {
          icon: 'lucide:bell',
          title: '桌面通知',
        },
      },
    ],
  },
];

export default routes;
