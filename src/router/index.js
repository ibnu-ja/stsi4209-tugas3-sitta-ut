import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StokView from '@/views/StokView.vue'
import TrackingView from '@/views/TrackingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Dashboard SITTA UT' },
    },
    {
      path: '/stok',
      name: 'stok',
      component: StokView,
      meta: { title: 'Stok Bahan Ajar - SITTA UT' },
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: TrackingView,
      meta: { title: 'Tracking Pengiriman - SITTA UT' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || 'SITTA UT - Universitas Terbuka'
})

export default router
