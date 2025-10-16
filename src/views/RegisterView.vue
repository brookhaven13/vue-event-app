<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">註冊新帳戶</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            登入現有帳戶
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- 輸入框容器 -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6">
          <!-- 用戶名輸入框 -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">用戶名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-user text-gray-400"></i>
              </div>
              <InputText
                id="username"
                v-model="form.username"
                type="text"
                placeholder="請輸入用戶名"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': usernameError }"
                required
              />
            </div>
            <small v-if="usernameError" class="text-red-600 text-sm">{{ usernameError }}</small>
          </div>

          <!-- 電子郵件輸入框 -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">電子郵件</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-envelope text-gray-400"></i>
              </div>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="請輸入電子郵件"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': emailError }"
                required
              />
            </div>
            <small v-if="emailError" class="text-red-600 text-sm">{{ emailError }}</small>
          </div>

          <!-- 密碼輸入框 -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">密碼</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <i class="pi pi-lock text-gray-400"></i>
              </div>
              <Password
                id="password"
                v-model="form.password"
                placeholder="請輸入密碼"
                :feedback="true"
                toggle-mask
                class="w-full"
                input-class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :input-style="{ 'border-color': passwordError ? '#fca5a5' : '' }"
                required
              />
            </div>
            <small v-if="passwordError" class="text-red-600 text-sm">{{ passwordError }}</small>
          </div>

          <!-- 確認密碼輸入框 -->
          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
              >確認密碼</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <i class="pi pi-lock text-gray-400"></i>
              </div>
              <Password
                id="confirmPassword"
                v-model="form.confirmPassword"
                placeholder="請再次輸入密碼"
                :feedback="false"
                toggle-mask
                class="w-full"
                input-class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                :input-style="{ 'border-color': confirmPasswordError ? '#fca5a5' : '' }"
                required
              />
            </div>
            <small v-if="confirmPasswordError" class="text-red-600 text-sm">{{
              confirmPasswordError
            }}</small>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-700 text-sm">{{ authStore.error }}</span>
          </div>
        </div>

        <!-- 註冊按鈕 -->
        <div>
          <Button
            type="submit"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <i v-if="!authStore.isLoading" class="pi pi-user-plus mr-2"></i>
            <i v-else class="pi pi-spin pi-spinner mr-2"></i>
            {{ authStore.isLoading ? '註冊中...' : '註冊' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const usernameError = computed(() => {
  if (!form.value.username) return ''
  return form.value.username.length < 3 ? '用戶名至少需要 3 個字符' : ''
})

const emailError = computed(() => {
  if (!form.value.email) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !emailRegex.test(form.value.email) ? '請輸入有效的電子郵件地址' : ''
})

const passwordError = computed(() => {
  if (!form.value.password) return ''
  return form.value.password.length < 6 ? '密碼至少需要 6 個字符' : ''
})

const confirmPasswordError = computed(() => {
  if (!form.value.confirmPassword) return ''
  return form.value.password !== form.value.confirmPassword ? '兩次輸入的密碼不一致' : ''
})

const isFormValid = computed(() => {
  return (
    form.value.username &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    !usernameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

const handleRegister = async () => {
  // 清除之前的錯誤
  authStore.clearError()

  // 驗證表單
  if (!isFormValid.value) {
    return
  }

  try {
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    })

    // 註冊成功後導向首頁
    router.push('/')
  } catch (error) {
    // 錯誤已經在 store 中處理
    console.error('Register failed:', error)
  }
}
</script>

<style scoped>
/* PrimeVue 組件的自定義樣式 */
:deep(.p-inputtext) {
  width: 100%;
  transition: all 0.2s ease-in-out;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
  transition: all 0.2s ease-in-out;
}

/* 輸入框容器陰影效果 */
.bg-white.rounded-xl.shadow-lg {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.bg-white.rounded-xl.shadow-lg:hover {
  box-shadow:
    0 20px 35px -5px rgba(0, 0, 0, 0.15),
    0 8px 10px -2px rgba(0, 0, 0, 0.08);
}

/* 按鈕樣式增強 */
:deep(.p-button) {
  border: none !important;
  font-weight: 600;
}

/* 圖標顏色調整 */
.pi-user,
.pi-envelope,
.pi-lock {
  font-size: 1rem;
}

/* 聚焦效果 */
:deep(.p-inputtext:focus),
:deep(.p-password .p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  border-color: #6366f1;
}

/* 禁用狀態樣式 */
:deep(.p-button:disabled) {
  background: #9ca3af !important;
  transform: none !important;
}
</style>
