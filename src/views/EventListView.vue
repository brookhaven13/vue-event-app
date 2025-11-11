<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 頁面標題和操作按鈕 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">活動列表</h1>
    </div>

    <!-- 載入狀態 -->
    <div v-if="eventStore.isLoading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="eventStore.error" class="text-center py-8">
      <Message severity="error" :closable="false">
        {{ eventStore.error }}
      </Message>
      <Button @click="loadEvents" class="mt-4">重新載入</Button>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="eventStore.events.length === 0" class="text-center py-12">
      <div class="text-gray-500 text-lg mb-4">目前沒有任何活動</div>
      <Button
        v-if="authStore.isAuthenticated"
        @click="$router.push('events/create')"
        class="bg-amber-600 hover:bg-amber-700 text-white"
      >
        建立第一個活動
      </Button>
    </div>

    <!-- 活動列表顯示邏輯 -->
    <div v-else>
      <!-- 登入者的活動 -->
      <div v-if="authStore.isAuthenticated && myEvents.length > 0">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-bold text-zinc-700">我的活動</h2>
          <Button
            icon="pi pi-plus"
            label="建立活動"
            class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md"
            @click="showCreateDialog = true"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- 建立活動 Dialog -->
          <Dialog v-model:visible="showCreateDialog" header="建立新活動" :modal="true" class="w-96">
            <form @submit.prevent="handleCreateEvent">
              <div class="mb-4">
                <label class="block mb-1 font-medium">標題</label>
                <input
                  v-model="createForm.name"
                  type="text"
                  class="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block mb-1 font-medium">描述</label>
                <textarea
                  v-model="createForm.description"
                  class="w-full border rounded px-2 py-1"
                  required
                ></textarea>
              </div>
              <div class="mb-4">
                <label class="block mb-1 font-medium">日期</label>
                <input
                  v-model="createForm.date"
                  type="datetime-local"
                  class="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block mb-1 font-medium">地點</label>
                <input
                  v-model="createForm.location"
                  type="text"
                  class="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div class="flex justify-end gap-2">
                <Button
                  label="取消"
                  @click="showCreateDialog = false"
                  class="p-button-text"
                  type="button"
                />
                <Button
                  label="建立"
                  type="submit"
                  class="bg-amber-600 text-white"
                  :loading="eventStore.isLoading"
                />
              </div>
            </form>
          </Dialog>
          <Card
            v-for="event in myEvents"
            :key="event.id"
            class="event-card rounded-lg cursor-pointer transform transition-transform hover:scale-103"
            @click="goToEventDetail(event.id)"
          >
            <template #header>
              <div
                class="h-48 bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center rounded-t-lg"
              >
                <i class="pi pi-calendar text-white text-6xl"></i>
              </div>
            </template>
            <template #title>
              <div class="text-xl font-semibold text-gray-900 truncate">{{ event.name }}</div>
            </template>
            <template #content>
              <div class="space-y-3">
                <p class="text-gray-600 line-clamp-3">{{ stripHtml(event.description) }}</p>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="pi pi-calendar mr-2"></i>{{ formatDate(event.date) }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="pi pi-map-marker mr-2"></i>{{ event.location }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="pi pi-user mr-2"></i>主辦者: {{ event.owner?.name || '未知' }}
                </div>
                <div v-if="event.attendees" class="flex items-center text-sm text-gray-500">
                  <i class="pi pi-users mr-2"></i>參與者: {{ event.attendees.length }} 人
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-between items-center pt-3">
                <Button
                  @click.stop="goToEventDetail(event.id)"
                  class="bg-amber-600 text-white rounded-md px-4 py-2"
                  size="small"
                  variant="outlined"
                  >查看詳情</Button
                >
                <div v-if="canEditEvent(event)" class="flex space-x-2">
                  <Button
                    @click.stop="editEvent(event.id)"
                    icon="pi pi-pencil"
                    class="p-button-text p-button-sm"
                    size="small"
                  />
                  <Button
                    @click.stop="confirmDeleteEvent(event)"
                    icon="pi pi-trash"
                    class="p-button-text p-button-danger p-button-sm"
                    size="small"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <!-- 所有活動（未登入或非個人活動） -->
      <h2 v-if="authStore.isAuthenticated" class="text-xl font-bold mb-2 text-gray-700">
        所有活動
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="event in otherEvents"
          :key="event.id"
          class="event-card rounded-lg cursor-pointer transform transition-transform hover:scale-103"
          @click="goToEventDetail(event.id)"
        >
          <template #header>
            <div
              class="h-48 bg-gradient-to-br from-amber-200 to-red-400 flex items-center justify-center rounded-t-lg"
            >
              <i class="pi pi-calendar text-white text-6xl"></i>
            </div>
          </template>
          <template #title>
            <div class="text-xl font-semibold text-gray-900 truncate">{{ event.name }}</div>
          </template>
          <template #content>
            <div class="space-y-3">
              <p class="text-gray-600 line-clamp-3">{{ stripHtml(event.description) }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <i class="pi pi-calendar mr-2"></i>{{ formatDate(event.date) }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="pi pi-map-marker mr-2"></i>{{ event.location }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="pi pi-user mr-2"></i>主辦者: {{ event.owner?.name || '未知' }}
              </div>
              <div v-if="event.attendees" class="flex items-center text-sm text-gray-500">
                <i class="pi pi-users mr-2"></i>參與者: {{ event.attendees.length }} 人
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between items-center pt-3">
              <Button
                @click.stop="goToEventDetail(event.id)"
                class="bg-amber-600 text-white rounded-md px-4 py-2"
                size="small"
                variant="outlined"
                >查看詳情</Button
              >
              <div v-if="canEditEvent(event)" class="flex space-x-2">
                <Button
                  @click.stop="editEvent(event.id)"
                  icon="pi pi-pencil"
                  class="p-button-text p-button-sm"
                  size="small"
                />
                <Button
                  @click.stop="confirmDeleteEvent(event)"
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger p-button-sm"
                  size="small"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 刪除確認對話框 -->
    <Dialog v-model:visible="deleteDialog" header="確認刪除" :modal="true" class="w-96">
      <p class="mb-4">您確定要刪除活動 "{{ eventToDelete?.name }}" 嗎？此操作無法復原。</p>
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
import { ref, onMounted, computed, reactive } from 'vue'
const showCreateDialog = ref(false)
const createForm = reactive({
  name: '',
  description: '',
  date: '',
  location: '',
})

const handleCreateEvent = async () => {
  try {
    let user = authStore.user
    if (!user) {
      const savedUser = localStorage.getItem('user')
      if (savedUser && savedUser !== 'undefined') {
        try {
          user = JSON.parse(savedUser)
        } catch {
          user = null
        }
      }
    }
    if (!user || !user.id) {
      window.location.href = '/login'
      return
    }
    const ownerId = user.id
    const name = createForm.name || ''

    console.log('DEBUG ownerId', ownerId)
    console.log('DEBUG name', name)
    await eventStore.createEvent({
      owner_id: ownerId,
      name,
      description: createForm.description,
      date: createForm.date,
      location: createForm.location,
    })
    showCreateDialog.value = false
    // 清空表單
    createForm.name = ''
    createForm.description = ''
    createForm.date = ''
    createForm.location = ''
    // 重新載入活動
    await loadEvents()
  } catch (error) {
    // 可根據 eventStore.error 顯示錯誤
    console.error('Failed to create event:', error)
  }
}
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import type { Event } from '@/types'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const router = useRouter()
const authStore = useAuthStore()
const eventStore = useEventStore()

const deleteDialog = ref(false)
const eventToDelete = ref<Event | null>(null)

onMounted(() => {
  authStore.initAuth()
  loadEvents()
})

const loadEvents = async () => {
  try {
    await eventStore.fetchEvents()
  } catch (error) {
    console.error('Failed to load events:', error)
  }
}

// 計算屬於登入者的活動
const myEvents = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return []
  return eventStore.events.filter((e) => e.owner.id === (authStore.user?.id ?? -1))
})

// 其他活動（不屬於登入者）
const otherEvents = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return eventStore.events
  return eventStore.events.filter((e) => e.owner.id !== (authStore.user?.id ?? -1))
})
const goToEventDetail = (eventId: number) => {
  router.push(`/events/${eventId}`)
}

const editEvent = (eventId: number) => {
  router.push(`/events/${eventId}/edit`)
}

const canEditEvent = (event: Event) => {
  if (!authStore.isAuthenticated || !authStore.user) return false
  // Admin 可以編輯所有活動，或者是活動主辦者
  return authStore.user.role === 'admin' || event.owner.id === authStore.user.id
}

const confirmDeleteEvent = (event: Event) => {
  eventToDelete.value = event
  deleteDialog.value = true
}

const handleDeleteEvent = async () => {
  if (!eventToDelete.value) return

  try {
    await eventStore.deleteEvent(eventToDelete.value.id)
    deleteDialog.value = false
    eventToDelete.value = null
  } catch (error) {
    console.error('Failed to delete event:', error)
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
  })
}

// 移除 HTML 標籤，取得純文字
const stripHtml = (html: string) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}
</script>

<style scoped>
.event-card {
  transition: all 0.2s ease-in-out;
}

.event-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
