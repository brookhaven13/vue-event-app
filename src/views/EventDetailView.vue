<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 載入狀態 -->
    <div v-if="eventStore.isLoading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="eventStore.error" class="text-center py-8">
      <Message severity="error" :closable="false">
        {{ eventStore.error }}
      </Message>
      <Button @click="loadEvent" class="mt-4">重新載入</Button>
    </div>

    <!-- 事件詳情 -->
    <div v-else-if="event" class="max-w-4xl mx-auto">
      <!-- 返回按鈕 -->
      <Button
        @click="$router.back()"
        icon="pi pi-arrow-left"
        class="p-button-text mb-4"
        label="返回"
      />

      <!-- 事件標題和操作按鈕 -->
      <div class="flex justify-between items-start space-x-2 mb-6 w-full">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2 w-full">{{ event.name }}</h1>
          <div class="flex items-center text-gray-600">
            <i class="pi pi-user mr-2"></i>
            <span>主辦者: {{ event.owner?.name || '未知' }}</span>
          </div>
        </div>

        <div v-if="canEditEvent" class="flex space-x-2 min-w-[11rem]">
          <Button @click="editEvent" icon="pi pi-pencil" label="編輯" class="p-button-outlined" />
          <Button
            @click="confirmDeleteEvent"
            icon="pi pi-trash"
            label="刪除"
            class="p-button-outlined p-button-danger"
          />
        </div>
      </div>

      <!-- 事件資訊卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 主要資訊 -->
        <div class="lg:col-span-2">
          <Card class="mb-6">
            <template #header>
              <div
                class="h-64 bg-gradient-to-br from-amber-200 to-red-400 flex items-center justify-center rounded-tl-lg rounded-tr-lg"
              >
                <i class="pi pi-calendar text-white text-8xl"></i>
              </div>
            </template>

            <template #content>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">活動描述</h3>
                  <div
                    class="text-gray-700 prose prose-slate max-w-none ql-editor-content"
                    v-html="event.description"
                  ></div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 側邊資訊 -->
        <div class="space-y-6">
          <!-- 基本資訊 -->
          <Card>
            <template #title>
              <div class="text-lg font-semibold">活動資訊</div>
            </template>

            <template #content>
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="pi pi-calendar text-gray-500 mt-1 mr-3"></i>
                  <div>
                    <div class="font-medium text-gray-900">日期時間</div>
                    <div class="text-gray-600">{{ formatDate(event.date) }}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="pi pi-map-marker text-gray-500 mt-1 mr-3"></i>
                  <div>
                    <div class="font-medium text-gray-900">地點</div>
                    <div class="text-gray-600">{{ event.location }}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <i class="pi pi-users text-gray-500 mt-1 mr-3"></i>
                  <div>
                    <div class="font-medium text-gray-900">參與人數</div>
                    <div class="text-gray-600">{{ attendeeCount }} 人</div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- 參與按鈕 -->
          <Card v-if="!canEditEvent">
            <template #content>
              <!-- 未登入用戶 -->
              <Button
                v-if="!authStore.isAuthenticated"
                @click="$router.push('/login')"
                class="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <i class="pi pi-sign-in mr-2"></i>
                請登入以參加活動
              </Button>

              <!-- 已登入用戶 - 未參加 -->
              <Button
                v-else-if="!isAttending"
                @click="joinEvent"
                class="w-full"
                :loading="joiningEvent"
              >
                <i class="pi pi-plus mr-2"></i>
                參加活動
              </Button>

              <!-- 已登入用戶 - 已參加 -->
              <Button
                v-else
                @click="leaveEvent"
                class="w-full p-button-outlined p-button-danger"
                :loading="leavingEvent"
              >
                <i class="pi pi-minus mr-2"></i>
                取消參加
              </Button>
            </template>
          </Card>

          <!-- 參與者列表 -->
          <Card v-if="event.attendees && event.attendees.length > 0">
            <template #title>
              <div class="text-lg font-semibold">參與者 ({{ event.attendees.length }})</div>
            </template>

            <template #content>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="attendee in event.attendees"
                  :key="attendee.id"
                  class="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <i class="pi pi-user text-white text-sm"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ attendee.name }}</div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <Dialog v-model:visible="deleteDialog" header="確認刪除" :modal="true" class="w-96">
      <p class="mb-4">您確定要刪除活動 "{{ event?.name }}" 嗎？此操作無法復原。</p>
      <template #footer>
        <Button label="取消" @click="deleteDialog = false" class="p-button-text" />
        <Button
          label="刪除"
          @click="handleDeleteEvent"
          class="p-button-danger"
          :loading="eventStore.isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { useNotification } from '@/composables/useNotification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()
const { showSuccess, showError } = useNotification()

const deleteDialog = ref(false)
const joiningEvent = ref(false)
const leavingEvent = ref(false)

const eventId = computed(() => Number(route.params.id))
const event = computed(() => eventStore.currentEvent)

const canEditEvent = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user || !event.value) return false
  // Admin 可以編輯所有活動，或者是活動主辦者
  return authStore.user.role === 'admin' || event.value.owner.id === authStore.user.id
})

const attendeeCount = computed(() => {
  return event.value?.attendees?.length || 0
})

const isAttending = ref(false)
watch(
  [() => authStore.user, () => event.value?.attendees],
  () => {
    if (!authStore.user || !event.value?.attendees) {
      isAttending.value = false
    } else {
      isAttending.value = event.value.attendees.some(
        (attendee) => attendee.id === authStore.user!.id,
      )
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadEvent()
})

const loadEvent = async () => {
  try {
    await eventStore.fetchEvent(eventId.value)
    await fetchAttendees()
  } catch (error) {
    console.error('Failed to load event:', error)
  }
}

const fetchAttendees = async () => {
  if (!event.value) return
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/events/${event.value.id}/attendees`,
    )
    event.value.attendees = response.data
  } catch (error) {
    console.error('Failed to fetch attendees:', error)
    showError('無法取得參加人數，請稍後再試。')
  }
}

const editEvent = () => {
  router.push(`/events/${eventId.value}/edit`)
}

const confirmDeleteEvent = () => {
  deleteDialog.value = true
}

const handleDeleteEvent = async () => {
  try {
    await eventStore.deleteEvent(eventId.value)
    showSuccess('活動已刪除')
    router.push('/events')
  } catch (error) {
    console.error('Failed to delete event:', error)
    showError('刪除活動失敗，請稍後再試。')
  } finally {
    deleteDialog.value = false
  }
}

const joinEvent = async () => {
  if (!event.value) return
  if (!authStore.user) {
    showError('請先登入以參加活動。')
    return
  }
  joiningEvent.value = true
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/events/${event.value.id}/attendees/${authStore.user.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    showSuccess('成功參加活動！')
    await fetchAttendees()
  } catch (error) {
    console.error('Failed to join event:', error)
    showError('參加活動失敗，請稍後再試。')
  } finally {
    joiningEvent.value = false
  }
}

const leaveEvent = async () => {
  if (!authStore.user) return

  leavingEvent.value = true
  try {
    await eventStore.removeAttendee(eventId.value, authStore.user.id)
    await fetchAttendees()
    isAttending.value = false
  } catch (error) {
    console.error('Failed to leave event:', error)
    showError('取消參加失敗，請稍後再試。')
  } finally {
    leavingEvent.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  })
}
</script>

<style scoped>
/* 自定義滾動條樣式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Quill Editor 內容樣式 */
.ql-editor-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.ql-editor-content :deep(p:last-child) {
  margin-bottom: 0;
}

.ql-editor-content :deep(ul),
.ql-editor-content :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
  list-style-position: outside;
}

.ql-editor-content :deep(ul) {
  list-style-type: disc;
}

.ql-editor-content :deep(ol) {
  list-style-type: decimal;
}

.ql-editor-content :deep(li) {
  margin-bottom: 0.5em;
  display: list-item;
}

.ql-editor-content :deep(strong) {
  font-weight: 600;
}

.ql-editor-content :deep(em) {
  font-style: italic;
}

.ql-editor-content :deep(u) {
  text-decoration: underline;
}

.ql-editor-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.ql-editor-content :deep(a:hover) {
  color: #1d4ed8;
}
</style>
