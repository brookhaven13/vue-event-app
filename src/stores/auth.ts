import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginRequest, RegisterRequest } from '@/types'
import { apiClient } from '@/services/api'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 初始化認證狀態 (從 localStorage 恢復)
  function initAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  // 登入
  async function login(credentials: LoginRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.login(credentials)

      token.value = response.token
      user.value = response.user

      // 保存到 localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '登入失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 註冊
  async function register(userData: RegisterRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.register(userData)

      token.value = response.token
      user.value = response.user

      // 保存到 localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '註冊失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  function logout() {
    user.value = null
    token.value = null
    error.value = null

    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 清除錯誤
  function clearError() {
    error.value = null
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    clearError,
  }
})
