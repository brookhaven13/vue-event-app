<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo 和品牌名稱 -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <i class="pi pi-calendar text-2xl text-indigo-600"></i>
            <span class="text-xl font-bold text-gray-900">EventApp</span>
          </router-link>
        </div>

        <!-- 桌面版導航選單 -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <router-link
              to="/events"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-indigo-600 bg-indigo-50': $route.path.startsWith('/events') }"
            >
              瀏覽活動
            </router-link>

            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/dashboard"
                class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-indigo-600 bg-indigo-50': $route.path === '/dashboard' }"
              >
                我的儀表板
              </router-link>

              <router-link
                to="/events/create"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                建立活動
              </router-link>
            </template>
          </div>
        </div>

        <!-- 用戶菜單 -->
        <div class="flex items-center space-x-4">
          <!-- 已登入用戶 -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="w-48" />
            <Button
              @click="toggleUserMenu"
              class="p-button-text p-button-plain flex items-center space-x-2"
            >
              <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-white text-sm"></i>
              </div>
              <span class="hidden sm:block text-gray-700">{{ authStore.user?.username }}</span>
              <i class="pi pi-chevron-down text-gray-500 text-xs"></i>
            </Button>
          </div>

          <!-- 未登入用戶 -->
          <div v-else class="flex items-center space-x-3">
            <router-link to="/login">
              <Button
                label="登入"
                class="p-button-outlined text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              />
            </router-link>
            <router-link to="/register">
              <Button label="註冊" class="bg-indigo-600 hover:bg-indigo-700 text-white" />
            </router-link>
          </div>

          <!-- 手機版菜單按鈕 -->
          <Button
            @click="toggleMobileMenu"
            icon="pi pi-bars"
            class="md:hidden p-button-text p-button-plain"
          />
        </div>
      </div>

      <!-- 手機版導航選單 -->
      <div v-show="isMobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
          <router-link
            to="/events"
            @click="isMobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-white transition-colors"
          >
            瀏覽活動
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/dashboard"
              @click="isMobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-white transition-colors"
            >
              我的儀表板
            </router-link>

            <router-link
              to="/events/create"
              @click="isMobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-white"
            >
              建立活動
            </router-link>

            <div class="border-t border-gray-200 pt-2">
              <button
                @click="handleLogout"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                登出
              </button>
            </div>
          </template>

          <template v-else>
            <div class="border-t border-gray-200 pt-2 space-y-1">
              <router-link
                to="/login"
                @click="isMobileMenuOpen = false"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-white transition-colors"
              >
                登入
              </router-link>
              <router-link
                to="/register"
                @click="isMobileMenuOpen = false"
                class="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-white"
              >
                註冊
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userMenu = ref()
const isMobileMenuOpen = ref(false)

const userMenuItems = computed(() => [
  {
    label: '我的儀表板',
    icon: 'pi pi-chart-line',
    command: () => router.push('/dashboard'),
  },
  {
    label: '瀏覽活動',
    icon: 'pi pi-list',
    command: () => router.push('/events'),
  },
  {
    separator: true,
  },
  {
    label: '建立活動',
    icon: 'pi pi-plus',
    command: () => router.push('/events/create'),
  },
  {
    separator: true,
  },
  {
    label: '登出',
    icon: 'pi pi-sign-out',
    command: handleLogout,
  },
])

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false

  // 如果當前在需要認證的頁面，導向首頁
  if (route.meta.requiresAuth) {
    router.push('/')
  }
}

// 監聽路由變化，關閉手機版菜單
router.afterEach(() => {
  isMobileMenuOpen.value = false
})
</script>

<style scoped>
/* 導航鏈接活躍狀態 */
.router-link-active {
  @apply text-indigo-600;
}

/* 平滑過渡動畫 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* 手機版菜單動畫 */
@media (max-width: 768px) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.2s ease;
  }

  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
