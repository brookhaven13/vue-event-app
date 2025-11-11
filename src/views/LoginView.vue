<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">登入您的帳戶</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          還沒有帳戶？
          <Button label="註冊新帳戶" @click="$router.push('/register')" link class="p-0 h-auto" />
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- 輸入框容器 -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6">
          <!-- 電子郵件輸入框 -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700"> 電子郵件 </label>
            <IconField>
              <InputIcon class="pi pi-envelope" />
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="請輸入您的電子郵件"
                class="w-full"
                :class="{ 'p-invalid': emailError }"
                required
              />
            </IconField>
            <small v-if="emailError" class="text-red-600 text-sm">{{ emailError }}</small>
          </div>

          <!-- 密碼輸入框 -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700"> 密碼 </label>
            <IconField>
              <InputIcon class="pi pi-lock" />
              <Password
                id="password"
                v-model="form.password"
                placeholder="請輸入您的密碼"
                :feedback="false"
                toggle-mask
                class="w-full"
                :class="{ 'p-invalid': passwordError }"
                required
              />
            </IconField>
            <small v-if="passwordError" class="text-red-600 text-sm">{{ passwordError }}</small>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-700 text-sm">{{ authStore.error }}</span>
          </div>
        </div>

        <!-- 登入按鈕 -->
        <div>
          <Button
            type="submit"
            :loading="authStore.isLoading"
            class="w-full bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-tranamber-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <i v-if="!authStore.isLoading" class="pi pi-sign-in mr-2"></i>
            <i v-else class="pi pi-spin pi-spinner mr-2"></i>
            {{ authStore.isLoading ? '登入中...' : '登入' }}
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
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
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

const handleLogin = async () => {
  // 清除之前的錯誤
  authStore.clearError()

  // 驗證表單
  if (emailError.value || passwordError.value) {
    return
  }

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    // 登入成功後導向 event 頁面
    router.push('/events')
  } catch (error) {
    // 錯誤已經在 store 中處理
    console.error('Login failed:', error)
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

/* 手機版按鈕樣式調整 */
@media (max-width: 768px) {
  .p-button {
    width: 100%;
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }
}
</style>
