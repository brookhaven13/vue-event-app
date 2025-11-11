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

      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">建立新活動</h1>
        <p class="text-gray-600 mt-2">填寫以下資訊來建立一個新的活動</p>
      </div>

      <!-- 表單 -->
      <Card>
        <template #content>
          <form @submit.prevent="handleCreateEvent" class="space-y-6">
            <!-- 標題 -->
            <div class="space-y-2">
              <label for="title" class="block text-sm font-medium text-gray-700">
                活動標題 *
              </label>
              <InputText
                id="title"
                v-model="form.name"
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
                    <button class="ql-list" value="ordered" v-tooltip.bottom="'有序列表'"></button>
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
              <label for="date" class="block text-sm font-medium text-gray-700"> 日期時間 * </label>
              <Calendar
                id="date"
                v-model="form.date"
                show-time
                hour-format="24"
                date-format="yy-mm-dd"
                placeholder="選擇日期和時間"
                class="w-full"
                :class="{ 'p-invalid': dateError }"
                :min-date="new Date()"
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
            <div v-if="eventStore.error" class="p-4 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <i class="pi pi-exclamation-triangle text-red-400 mr-2 mt-0.5"></i>
                <div class="text-red-700">{{ eventStore.error }}</div>
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
                label="建立活動"
                :loading="eventStore.isLoading"
                :disabled="!isFormValid"
                class="bg-amber-600 hover:bg-amber-700"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor'
import Calendar from 'primevue/calendar'

const router = useRouter()
const eventStore = useEventStore()
const authStore = useAuthStore()

const form = ref({
  name: '',
  description: '',
  date: null as Date | null,
  location: '',
})

const titleError = computed(() => {
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
  const now = new Date()
  return form.value.date <= now ? '活動日期必須是未來的時間' : ''
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
    !titleError.value &&
    !descriptionError.value &&
    !dateError.value &&
    !locationError.value
  )
})

const handleCreateEvent = async () => {
  // 清除之前的錯誤
  eventStore.clearError()

  // 驗證表單
  if (!isFormValid.value) {
    return
  }

  try {
    if (!authStore.user) {
      eventStore.error = '使用者未登入，無法建立活動'
      return
    }
    const eventData = {
      owner_id: authStore.user.id,
      name: form.value.name,
      description: form.value.description,
      date: form.value.date!.toISOString(),
      location: form.value.location,
    }

    const createdEvent = await eventStore.createEvent(eventData)
    console.log('DEBUG createdEvent', createdEvent)
    // 建立成功後導向事件詳情頁面
    router.push(`/events/${createdEvent.id}`)
  } catch (error) {
    // 錯誤已經在 store 中處理
    console.error('Create event failed:', error)
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
