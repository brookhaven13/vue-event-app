import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/EventListView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventListView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/events/create',
      name: 'create-event',
      component: () => import('../views/CreateEventView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: () => import('../views/EventDetailView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/events/:id/edit',
      name: 'edit-event',
      component: () => import('../views/EditEventView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守衛
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 初始化認證狀態
  authStore.initAuth()

  // 檢查是否需要認證
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // 如果已登入用戶訪問登入/註冊頁面，重定向到首頁
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
