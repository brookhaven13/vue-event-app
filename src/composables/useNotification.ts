import { useToast } from 'primevue/usetoast'

export const useNotification = () => {
  const toast = useToast()

  const showSuccess = (message: string, summary = '成功') => {
    toast.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000,
    })
  }

  const showError = (message: string, summary = '錯誤') => {
    toast.add({
      severity: 'error',
      summary,
      detail: message,
      life: 5000,
    })
  }

  const showWarning = (message: string, summary = '警告') => {
    toast.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 4000,
    })
  }

  const showInfo = (message: string, summary = '信息') => {
    toast.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
