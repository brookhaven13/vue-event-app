<template>
  <div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6 text-indigo-700">使用者詳細資料</h2>
    <div class="mb-4">
      <label class="block text-gray-600 font-medium mb-1">名稱</label>
      <div class="text-gray-900">{{ user?.name }}</div>
    </div>
    <div class="mb-4">
      <label class="block text-gray-600 font-medium mb-1">Email</label>
      <div class="text-gray-900">{{ user?.email }}</div>
    </div>
    <div class="mb-4">
      <label class="block text-gray-600 font-medium mb-1">密碼</label>
      <div class="text-gray-900">{{ maskedPassword }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = authStore.user

const maskedPassword = computed(() => {
  // 假設密碼長度為 8，全部用 * 取代
  return user ? '*'.repeat(8) : ''
})
</script>

<style scoped>
/* 基本樣式 */
</style>
