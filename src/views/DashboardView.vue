<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">我的儀表板</h1>
        <p class="text-gray-600 mt-2">歡迎回來，{{ authStore.user?.username }}！</p>
      </div>

      <!-- 統計卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm opacity-90">我主辦的活動</div>
                <div class="text-3xl font-bold">{{ myEventsCount }}</div>
              </div>
              <i class="pi pi-calendar text-3xl opacity-75"></i>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm opacity-90">我參與的活動</div>
                <div class="text-3xl font-bold">{{ attendingEventsCount }}</div>
              </div>
              <i class="pi pi-users text-3xl opacity-75"></i>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm opacity-90">總參與者</div>
                <div class="text-3xl font-bold">{{ totalAttendeesCount }}</div>
              </div>
              <i class="pi pi-chart-bar text-3xl opacity-75"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- 快速操作 -->
      <Card class="mb-8">
        <template #title>
          <div class="text-lg font-semibold">快速操作</div>
        </template>
        <template #content>
          <div class="flex flex-wrap gap-4">
            <Button
              @click="$router.push('/events/create')"
              icon="pi pi-plus"
              label="建立新活動"
              class="bg-indigo-600 hover:bg-indigo-700"
            />
            <Button
              @click="$router.push('/events')"
              icon="pi pi-list"
              label="瀏覽所有活動"
              class="p-button-outlined"
            />
          </div>
        </template>
      </Card>

      <!-- 我的活動和參與的活動 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 我主辦的活動 -->
        <Card>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">我主辦的活動</span>
              <Button
                @click="$router.push('/events/create')"
                icon="pi pi-plus"
                class="p-button-text p-button-sm"
                size="small"
              />
            </div>
          </template>

          <template #content>
            <!-- 載入狀態 -->
            <div v-if="eventStore.isLoading" class="flex justify-center py-8">
              <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
            </div>

            <!-- 空狀態 -->
            <div v-else-if="myEvents.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-calendar text-4xl mb-4 block"></i>
              <div>您還沒有主辦任何活動</div>
            </div>

            <!-- 活動列表 -->
            <div v-else class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="event in myEvents"
                :key="event.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                @click="$router.push(`/events/${event.id}`)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 truncate">{{ event.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ event.description }}</p>
                    <div class="flex items-center text-xs text-gray-500 mt-2">
                      <i class="pi pi-calendar mr-1"></i>
                      {{ formatDate(event.date) }}
                    </div>
                  </div>
                  <div class="flex space-x-1 ml-4">
                    <Button
                      @click.stop="$router.push(`/events/${event.id}/edit`)"
                      icon="pi pi-pencil"
                      class="p-button-text p-button-sm"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- 我參與的活動 -->
        <Card>
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">我參與的活動</span>
              <Button
                @click="$router.push('/events')"
                icon="pi pi-search"
                class="p-button-text p-button-sm"
                size="small"
              />
            </div>
          </template>

          <template #content>
            <!-- 載入狀態 -->
            <div v-if="eventStore.isLoading" class="flex justify-center py-8">
              <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
            </div>

            <!-- 空狀態 -->
            <div v-else-if="attendingEvents.length === 0" class="text-center py-8 text-gray-500">
              <i class="pi pi-users text-4xl mb-4 block"></i>
              <div>您還沒有參與任何活動</div>
            </div>

            <!-- 活動列表 -->
            <div v-else class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="event in attendingEvents"
                :key="event.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                @click="$router.push(`/events/${event.id}`)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 truncate">{{ event.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ event.description }}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <div class="flex items-center">
                        <i class="pi pi-calendar mr-1"></i>
                        {{ formatDate(event.date) }}
                      </div>
                      <div class="text-right">
                        <div>主辦: {{ event.organizer?.username }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const authStore = useAuthStore()
const eventStore = useEventStore()

const myEvents = computed(() => {
  if (!authStore.user) return []
  return eventStore.events.filter((event) => event.organizer_id === authStore.user!.id)
})

const attendingEvents = computed(() => {
  if (!authStore.user) return []
  return eventStore.events.filter((event) =>
    event.attendees?.some((attendee) => attendee.id === authStore.user!.id),
  )
})

const myEventsCount = computed(() => myEvents.value.length)
const attendingEventsCount = computed(() => attendingEvents.value.length)

const totalAttendeesCount = computed(() => {
  return myEvents.value.reduce((total, event) => {
    return total + (event.attendees?.length || 0)
  }, 0)
})

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
</style>
