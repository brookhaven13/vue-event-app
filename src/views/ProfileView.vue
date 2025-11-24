<template>
  <div class="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6 text-amber-700">使用者詳細資料</h2>
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
    <Button @click="navigateToEdit" label="編輯" class="p-button-rounded p-button-primary w-full" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const maskedPassword = computed(() => {
  // 假設密碼長度為 8，全部用 * 取代
  return user ? '*'.repeat(8) : ''
})

const navigateToEdit = () => {
  // router.push('/profile/edit')
}
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
