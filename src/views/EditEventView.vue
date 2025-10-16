<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- 返回按鈕 -->
      <Button
        @click="$router.back()"
        icon="pi pi-arrow-left"
        class="p-button-text mb-4"
        label="返回"
      />

      <!-- 載入狀態 -->
      <div v-if="eventStore.isLoading && !event" class="flex justify-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="eventStore.error && !event" class="text-center py-8">
        <Message severity="error" :closable="false">
          {{ eventStore.error }}
        </Message>
        <Button @click="loadEvent" class="mt-4">重新載入</Button>
      </div>

      <!-- 編輯表單 -->
      <div v-else-if="event">
        <!-- 頁面標題 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">編輯活動</h1>
          <p class="text-gray-600 mt-2">修改 "{{ event.title }}" 的資訊</p>
        </div>

        <!-- 表單 -->
        <Card>
          <template #content>
            <form @submit.prevent="handleUpdateEvent" class="space-y-6">
              <!-- 標題 -->
              <div class="space-y-2">
                <label for="title" class="block text-sm font-medium text-gray-700">
                  活動標題 *
                </label>
                <InputText
                  id="title"
                  v-model="form.title"
                  placeholder="請輸入活動標題"
                  class="w-full"
                  :class="{ 'p-invalid': titleError }"
                  required
                />
                <small v-if="titleError" class="p-error">{{ titleError }}</small>
              </div>

              <!-- 描述 -->
              <div class="space-y-2">
                <label for="description" class="block text-sm font-medium text-gray-700">
                  活動描述 *
                </label>
                <Textarea
                  id="description"
                  v-model="form.description"
                  placeholder="請輸入活動描述"
                  class="w-full"
                  :class="{ 'p-invalid': descriptionError }"
                  rows="5"
                  required
                />
                <small v-if="descriptionError" class="p-error">{{ descriptionError }}</small>
              </div>

              <!-- 日期時間 -->
              <div class="space-y-2">
                <label for="date" class="block text-sm font-medium text-gray-700">
                  日期時間 *
                </label>
                <Calendar
                  id="date"
                  v-model="form.date"
                  show-time
                  hour-format="24"
                  date-format="yy-mm-dd"
                  placeholder="選擇日期和時間"
                  class="w-full"
                  :class="{ 'p-invalid': dateError }"
                  required
                />
                <small v-if="dateError" class="p-error">{{ dateError }}</small>
              </div>

              <!-- 地點 -->
              <div class="space-y-2">
                <label for="location" class="block text-sm font-medium text-gray-700">
                  活動地點 *
                </label>
                <InputText
                  id="location"
                  v-model="form.location"
                  placeholder="請輸入活動地點"
                  class="w-full"
                  :class="{ 'p-invalid': locationError }"
                  required
                />
                <small v-if="locationError" class="p-error">{{ locationError }}</small>
              </div>

              <!-- 錯誤訊息 -->
              <div v-if="updateError" class="p-4 bg-red-50 border border-red-200 rounded-md">
                <div class="flex">
                  <i class="pi pi-exclamation-triangle text-red-400 mr-2 mt-0.5"></i>
                  <div class="text-red-700">{{ updateError }}</div>
                </div>
              </div>

              <!-- 提交按鈕 -->
              <div class="flex justify-end space-x-3">
                <Button
                  type="button"
                  @click="$router.back()"
                  label="取消"
                  class="p-button-outlined"
                />
                <Button
                  type="submit"
                  label="更新活動"
                  :loading="isUpdating"
                  :disabled="!isFormValid || !hasChanges"
                  class="bg-indigo-600 hover:bg-indigo-700"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()

const isUpdating = ref(false)
const updateError = ref<string | null>(null)

const form = ref({
  title: '',
  description: '',
  date: null as Date | null,
  location: '',
})

const originalForm = ref({
  title: '',
  description: '',
  date: null as Date | null,
  location: '',
})

const eventId = computed(() => Number(route.params.id))
const event = computed(() => eventStore.currentEvent)

const titleError = computed(() => {
  if (!form.value.title) return ''
  return form.value.title.length < 3 ? '標題至少需要 3 個字符' : ''
})

const descriptionError = computed(() => {
  if (!form.value.description) return ''
  return form.value.description.length < 10 ? '描述至少需要 10 個字符' : ''
})

const dateError = computed(() => {
  if (!form.value.date) return ''
  // 編輯時允許過去的日期（可能是已經開始的活動）
  return false
})

const locationError = computed(() => {
  if (!form.value.location) return ''
  return form.value.location.length < 3 ? '地點至少需要 3 個字符' : ''
})

const isFormValid = computed(() => {
  return (
    form.value.title &&
    form.value.description &&
    form.value.date &&
    form.value.location &&
    !titleError.value &&
    !descriptionError.value &&
    !dateError.value &&
    !locationError.value
  )
})

const hasChanges = computed(() => {
  return (
    form.value.title !== originalForm.value.title ||
    form.value.description !== originalForm.value.description ||
    form.value.date?.getTime() !== originalForm.value.date?.getTime() ||
    form.value.location !== originalForm.value.location
  )
})

// 檢查權限
const canEdit = computed(() => {
  return (
    authStore.isAuthenticated &&
    authStore.user &&
    event.value &&
    event.value.organizer_id === authStore.user.id
  )
})

onMounted(async () => {
  await loadEvent()

  // 權限檢查
  if (event.value && !canEdit.value) {
    router.push(`/events/${eventId.value}`)
    return
  }
})

// 監聽事件載入完成，填充表單
watch(
  event,
  (newEvent) => {
    if (newEvent) {
      const eventDate = new Date(newEvent.date)

      form.value = {
        title: newEvent.title,
        description: newEvent.description,
        date: eventDate,
        location: newEvent.location,
      }

      originalForm.value = {
        title: newEvent.title,
        description: newEvent.description,
        date: eventDate,
        location: newEvent.location,
      }
    }
  },
  { immediate: true },
)

const loadEvent = async () => {
  try {
    await eventStore.fetchEvent(eventId.value)
  } catch (error) {
    console.error('Failed to load event:', error)
  }
}

const handleUpdateEvent = async () => {
  // 清除之前的錯誤
  updateError.value = null

  // 驗證表單
  if (!isFormValid.value || !hasChanges.value) {
    return
  }

  isUpdating.value = true

  try {
    const eventData: Record<string, string> = {}

    // 只包含有變更的欄位
    if (form.value.title !== originalForm.value.title) {
      eventData.title = form.value.title
    }
    if (form.value.description !== originalForm.value.description) {
      eventData.description = form.value.description
    }
    if (form.value.date?.getTime() !== originalForm.value.date?.getTime()) {
      eventData.date = form.value.date!.toISOString()
    }
    if (form.value.location !== originalForm.value.location) {
      eventData.location = form.value.location
    }
    await eventStore.updateEvent(eventId.value, eventData)

    // 更新成功後導向事件詳情頁面
    router.push(`/events/${eventId.value}`)
  } catch (error: unknown) {
    interface ApiError {
      response?: {
        data?: {
          message?: string
        }
      }
    }
    updateError.value = (error as ApiError)?.response?.data?.message || '更新活動失敗'
    console.error('Update event failed:', error)
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-inputtext) {
  width: 100%;
}
</style>
