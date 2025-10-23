<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 頁面標題和操作按鈕 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">活動列表</h1>
      <Button
        v-if="authStore.isAuthenticated"
        @click="$router.push('events/create')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
      >
        <i class="pi pi-plus mr-2"></i>
        建立活動
      </Button>
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
        class="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        建立第一個活動
      </Button>
    </div>

    <!-- 活動列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="event in eventStore.events"
        :key="event.id"
        class="event-card cursor-pointer transform transition-transform hover:scale-105"
        @click="goToEventDetail(event.id)"
      >
        <template #header>
          <div
            class="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
          >
            <i class="pi pi-calendar text-white text-6xl"></i>
          </div>
        </template>

        <template #title>
          <div class="text-xl font-semibold text-gray-900 truncate">
            {{ event.title }}
          </div>
        </template>

        <template #content>
          <div class="space-y-3">
            <p class="text-gray-600 line-clamp-3">
              {{ event.description }}
            </p>

            <div class="flex items-center text-sm text-gray-500">
              <i class="pi pi-calendar mr-2"></i>
              {{ formatDate(event.date) }}
            </div>

            <div class="flex items-center text-sm text-gray-500">
              <i class="pi pi-map-marker mr-2"></i>
              {{ event.location }}
            </div>

            <div class="flex items-center text-sm text-gray-500">
              <i class="pi pi-user mr-2"></i>
              主辦者: {{ event.organizer?.username || '未知' }}
            </div>

            <div v-if="event.attendees" class="flex items-center text-sm text-gray-500">
              <i class="pi pi-users mr-2"></i>
              參與者: {{ event.attendees.length }} 人
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between items-center">
            <Button @click.stop="goToEventDetail(event.id)" class="p-button-text" size="small">
              查看詳情
            </Button>

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

    <!-- 刪除確認對話框 -->
    <Dialog v-model:visible="deleteDialog" header="確認刪除" :modal="true" class="w-96">
      <p class="mb-4">您確定要刪除活動 "{{ eventToDelete?.title }}" 嗎？此操作無法復原。</p>
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
import { ref, onMounted } from 'vue'
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
  loadEvents()
})

const loadEvents = async () => {
  try {
    await eventStore.fetchEvents()
  } catch (error) {
    console.error('Failed to load events:', error)
  }
}

const goToEventDetail = (eventId: number) => {
  router.push(`/events/${eventId}`)
}

const editEvent = (eventId: number) => {
  router.push(`/events/${eventId}/edit`)
}

const canEditEvent = (event: Event) => {
  return authStore.isAuthenticated && authStore.user && event.organizer_id === authStore.user.id
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
