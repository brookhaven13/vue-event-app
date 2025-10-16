<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 導航欄 -->
    <AppNavbar />

    <!-- 主要內容區域 -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- 頁腳 -->
    <AppFooter />

    <!-- Toast 通知 -->
    <Toast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import Toast from 'primevue/toast'

const authStore = useAuthStore()

onMounted(() => {
  // 初始化認證狀態
  authStore.initAuth()
})
</script>

<style scoped>
/* 確保頁面最小高度為視窗高度 */
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
