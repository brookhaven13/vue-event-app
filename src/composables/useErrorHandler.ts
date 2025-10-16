import { ref } from 'vue'

export interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
      error?: string
    }
  }
  message?: string
}

export const useErrorHandler = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const handleError = (err: unknown): string => {
    console.error('Error occurred:', err)

    if (!err) {
      return '發生未知錯誤'
    }

    const apiError = err as ApiError

    // 處理網路錯誤
    if (!apiError.response) {
      return '網路連接失敗，請檢查您的網路連接'
    }

    // 處理 HTTP 狀態碼
    switch (apiError.response.status) {
      case 400:
        return apiError.response.data?.message || '請求參數錯誤'
      case 401:
        return '認證失敗，請重新登入'
      case 403:
        return '權限不足，無法執行此操作'
      case 404:
        return '請求的資源不存在'
      case 409:
        return apiError.response.data?.message || '資源衝突'
      case 422:
        return apiError.response.data?.message || '資料驗證失敗'
      case 429:
        return '請求過於頻繁，請稍後再試'
      case 500:
        return '伺服器內部錯誤，請稍後再試'
      case 502:
        return '伺服器暫時無法使用'
      case 503:
        return '服務暫時不可用'
      default:
        return (
          apiError.response.data?.message ||
          apiError.response.data?.error ||
          apiError.message ||
          '發生未知錯誤'
        )
    }
  }

  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    loadingRef?: typeof isLoading,
  ): Promise<T | null> => {
    const loading = loadingRef || isLoading

    loading.value = true
    error.value = null

    try {
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = handleError(err)
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading,
    error,
    handleError,
    withErrorHandling,
    clearError,
  }
}
