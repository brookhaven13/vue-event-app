<template>
  <div class="flex items-center space-x-4">
    <!-- 已登入用戶 - 桌面版 -->
    <div v-if="authStore.isAuthenticated" class="hidden md:block relative">
      <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="w-48" />
      <Button @click="toggleUserMenu" class="p-button-text p-button-plain flex items-center">
        <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
          <i class="pi pi-user text-white text-xs"></i>
        </div>
        <span class="hidden sm:block text-gray-700 text-sm">{{ authStore.user?.name }}</span>
        <i class="pi pi-chevron-down text-gray-500 text-xs"></i>
      </Button>
    </div>

    <!-- 未登入用戶 - 桌面版 -->
    <div v-else class="hidden md:flex items-center space-x-3">
      <router-link
        to="/login"
        class="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >登入</router-link
      >
      <router-link
        to="/register"
        class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-700"
        >註冊</router-link
      >
    </div>

    <!-- 手機版菜單按鈕 -->
    <div class="md:hidden">
      <Button
        @click="emit('toggle-mobile-menu')"
        icon="pi pi-bars"
        class="p-button-text p-button-plain"
      />
    </div>
  </div>
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

const emit = defineEmits<{
  'toggle-mobile-menu': []
}>()

const userMenuItems = computed(() => [
  {
    label: '詳細資料',
    icon: 'pi pi-user',
    command: () => router.push('/profile'),
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

const handleLogout = () => {
  authStore.logout()

  // 如果當前在需要認證的頁面，導向首頁
  if (route.meta.requiresAuth) {
    router.push('/')
  }
}
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
