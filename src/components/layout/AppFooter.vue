<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌信息 -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <i class="pi pi-calendar text-2xl text-indigo-600"></i>
            <span class="text-xl font-bold text-gray-900">EventApp</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            一個現代化的活動管理平台，讓您輕鬆創建、管理和參與各種活動。 連接人們，創造美好的體驗。
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-indigo-600 transition-colors">
              <i class="pi pi-facebook text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-indigo-600 transition-colors">
              <i class="pi pi-twitter text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-indigo-600 transition-colors">
              <i class="pi pi-instagram text-lg"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-indigo-600 transition-colors">
              <i class="pi pi-linkedin text-lg"></i>
            </a>
          </div>
        </div>

        <!-- 快速鏈接 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            快速鏈接
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/events"
                class="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
              >
                瀏覽活動
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated">
              <router-link
                to="/dashboard"
                class="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
              >
                我的儀表板
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated">
              <router-link
                to="/events/create"
                class="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
              >
                建立活動
              </router-link>
            </li>
            <li v-if="!authStore.isAuthenticated">
              <router-link
                to="/login"
                class="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
              >
                登入
              </router-link>
            </li>
            <li v-if="!authStore.isAuthenticated">
              <router-link
                to="/register"
                class="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
              >
                註冊
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 支援信息 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">支援</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                幫助中心
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                聯絡我們
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                隱私政策
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                服務條款
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版權信息 -->
      <div class="border-t border-gray-200 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-600 text-sm">© {{ currentYear }} EventApp. 版權所有.</p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <span class="text-gray-600 text-sm"> 使用 Vue.js 和 PrimeVue 構建 </span>
            <div class="flex items-center space-x-2">
              <i class="pi pi-heart text-red-500 text-sm"></i>
              <span class="text-gray-600 text-sm">用心製作</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.transition-colors {
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
