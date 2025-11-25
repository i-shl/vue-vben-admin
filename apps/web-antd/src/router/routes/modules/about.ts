import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'About',
    path: '/about',
    component: () => import('#/views/about/index.vue'),
    meta: {
      icon: 'lucide:copyright',
      title: '关于',
      order: 9999,
    },
  },
];
export default routes;
