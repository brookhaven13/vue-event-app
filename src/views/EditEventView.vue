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
          <p class="text-gray-600 mt-2">修改 "{{ event.name }}" 的資訊</p>
        </div>

        <!-- 表單 -->
        <Card>
          <template #content>
            <form @submit.prevent="handleUpdateEvent" class="space-y-6">
              <!-- 標題 -->
              <div class="space-y-2">
                <label for="name" class="block text-sm font-medium text-gray-700">
                  活動標題 *
                </label>
                <InputText
                  id="name"
                  v-model="form.name"
                  placeholder="請輸入活動標題"
                  class="w-full"
                  :class="{ 'p-invalid': nameError }"
                  required
                />
                <small v-if="nameError" class="p-error">{{ nameError }}</small>
              </div>

              <!-- 描述 -->
              <div class="space-y-2">
                <label for="description" class="block text-sm font-medium text-gray-700">
                  活動描述 *
                </label>
                <Editor
                  id="description"
                  v-model="form.description"
                  editor-style="height: 320px"
                  class="w-full"
                  :class="{ 'p-invalid': descriptionError }"
                >
                  <template #toolbar>
                    <span class="ql-formats">
                      <button class="ql-bold" v-tooltip.bottom="'粗體'"></button>
                      <button class="ql-italic" v-tooltip.bottom="'斜體'"></button>
                      <button class="ql-underline" v-tooltip.bottom="'底線'"></button>
                    </span>
                    <span class="ql-formats">
                      <button
                        class="ql-list"
                        value="ordered"
                        v-tooltip.bottom="'有序列表'"
                      ></button>
                      <button class="ql-list" value="bullet" v-tooltip.bottom="'無序列表'"></button>
                    </span>
                    <span class="ql-formats">
                      <button class="ql-link" v-tooltip.bottom="'插入連結'"></button>
                    </span>
                    <span class="ql-formats">
                      <button class="ql-clean" v-tooltip.bottom="'清除格式'"></button>
                    </span>
                  </template>
                </Editor>
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
                  severity="secondary"
                />
                <Button
                  type="submit"
                  label="更新活動"
                  :loading="isUpdating"
                  :disabled="!isFormValid || !hasChanges"
                  class="bg-blue-600 hover:bg-blue-700"
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
import Editor from 'primevue/editor'
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
  name: '',
  description: '',
  date: null as Date | null,
  location: '',
})

const originalForm = ref({
  name: '',
  description: '',
  date: null as Date | null,
  location: '',
})

const eventId = computed(() => Number(route.params.id))
const event = computed(() => eventStore.currentEvent)

const nameError = computed(() => {
  if (!form.value.name) return ''
  return form.value.name.length < 3 ? '標題至少需要 3 個字符' : ''
})

const descriptionError = computed(() => {
  if (!form.value.description) return ''
  // 移除 HTML 標籤來計算實際文字長度
  const textContent = form.value.description.replace(/<[^>]*>/g, '').trim()
  return textContent.length < 10 ? '描述至少需要 10 個字符' : ''
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
    form.value.name &&
    form.value.description &&
    form.value.date &&
    form.value.location &&
    !nameError.value &&
    !descriptionError.value &&
    !dateError.value &&
    !locationError.value
  )
})

const hasChanges = computed(() => {
  return (
    form.value.name !== originalForm.value.name ||
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
    event.value.owner.id === authStore.user.id
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
        name: newEvent.name,
        description: newEvent.description,
        date: eventDate,
        location: newEvent.location,
      }

      originalForm.value = {
        name: newEvent.name,
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
    // 發送所有必要欄位，格式與 createEvent 一致
    const eventData = {
      name: form.value.name,
      description: form.value.description,
      date: form.value.date!.toISOString(),
      location: form.value.location,
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
