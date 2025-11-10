<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">管理我的活動</h1>
        <p class="text-gray-600 mt-2">查看、編輯和刪除您主辦的所有活動</p>
      </div>

      <!-- 載入狀態 -->
      <div v-if="eventStore.isLoading" class="flex justify-center py-12">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="eventStore.error" class="text-center py-8">
        <Message severity="error" :closable="false">
          {{ eventStore.error }}
        </Message>
        <Button @click="loadEvents" class="mt-4">重新載入</Button>
      </div>

      <!-- 活動列表 -->
      <div v-else>
        <!-- 統計資訊 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card class="bg-blue-50">
            <template #content>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ totalEvents }}</div>
                <div class="text-sm text-gray-600">我的活動總數</div>
              </div>
            </template>
          </Card>
          <Card class="bg-blue-50">
            <template #content>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ upcomingEvents }}</div>
                <div class="text-sm text-gray-600">即將舉辦</div>
              </div>
            </template>
          </Card>
          <Card class="bg-gray-50">
            <template #content>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-600">{{ pastEvents }}</div>
                <div class="text-sm text-gray-600">已結束</div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 活動表格 -->
        <Card>
          <template #title>
            <div class="flex justify-between items-center">
              <span>我的活動列表</span>
              <Button
                @click="$router.push('/events/create')"
                icon="pi pi-plus"
                label="建立新活動"
                class="bg-blue-600 hover:bg-blue-700"
                size="small"
              />
            </div>
          </template>
          <template #content>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      活動名稱
                    </th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">日期</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">地點</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      參與人數
                    </th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">狀態</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="event in myEvents"
                    :key="event.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-4">
                      <div class="flex items-center">
                        <i class="pi pi-calendar text-blue-600 mr-2"></i>
                        <span class="font-medium text-gray-900">{{ event.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">
                      {{ formatDate(event.date) }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <i class="pi pi-map-marker text-gray-400 mr-1 text-xs"></i>
                        {{ event.location }}
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <i class="pi pi-users text-gray-400 mr-1 text-xs"></i>
                        {{ event.attendees?.length || 0 }} 人
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      <span
                        v-if="isUpcoming(event.date)"
                        class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                      >
                        即將舉辦
                      </span>
                      <span
                        v-else
                        class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                      >
                        已結束
                      </span>
                    </td>
                    <td class="px-4 py-4">
                      <div class="flex items-center space-x-2">
                        <Button
                          @click="viewEvent(event.id)"
                          icon="pi pi-eye"
                          class="p-button-text p-button-sm text-zinc-700 hover:text-zinc-900"
                          v-tooltip.top="'查看詳情'"
                        />
                        <Button
                          @click="editEvent(event.id)"
                          icon="pi pi-pencil"
                          class="p-button-text p-button-sm text-blue-600 hover:text-blue-700"
                          v-tooltip.top="'編輯'"
                        />
                        <Button
                          @click="confirmDeleteEvent(event)"
                          icon="pi pi-trash"
                          class="p-button-text p-button-sm text-red-600 hover:text-red-700"
                          v-tooltip.top="'刪除'"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 空狀態 -->
              <div v-if="myEvents.length === 0" class="text-center py-12 text-gray-500">
                <i class="pi pi-inbox text-4xl mb-4"></i>
                <p>您還沒有主辦任何活動</p>
                <Button
                  @click="$router.push('/events/create')"
                  icon="pi pi-plus"
                  label="建立第一個活動"
                  class="mt-4 bg-blue-600 hover:bg-blue-700"
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
import { ref, computed, onMounted } from 'vue'
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

// 檢查是否已登入
if (!authStore.isAuthenticated) {
  router.push('/login')
}

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

// 取得我主辦的所有活動（包含已過期）
const myEvents = computed(() => {
  if (!authStore.user) return []
  return eventStore.events.filter((event) => event.owner.id === authStore.user!.id)
})

// 統計資訊
const totalEvents = computed(() => myEvents.value.length)

const upcomingEvents = computed(() => {
  return myEvents.value.filter((event) => isUpcoming(event.date)).length
})

const pastEvents = computed(() => {
  return myEvents.value.filter((event) => !isUpcoming(event.date)).length
})

// 日期處理
const isUpcoming = (dateString: string) => {
  return new Date(dateString) > new Date()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 操作方法
const viewEvent = (eventId: number) => {
  router.push(`/events/${eventId}`)
}

const editEvent = (eventId: number) => {
  router.push(`/events/${eventId}/edit`)
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
    await loadEvents()
  } catch (error) {
    console.error('Failed to delete event:', error)
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
