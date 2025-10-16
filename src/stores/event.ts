import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Event, CreateEventRequest, UpdateEventRequest } from '@/types'
import { apiClient } from '@/services/api'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 獲取所有事件
  async function fetchEvents() {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getEvents()
      events.value = response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '獲取事件列表失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 獲取單個事件
  async function fetchEvent(id: number) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.getEvent(id)
      currentEvent.value = response
      return response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '獲取事件詳情失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 創建事件
  async function createEvent(eventData: CreateEventRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.createEvent(eventData)
      events.value.push(response)
      return response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '創建事件失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新事件
  async function updateEvent(id: number, eventData: UpdateEventRequest) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.updateEvent(id, eventData)

      // 更新本地事件列表
      const index = events.value.findIndex((event) => event.id === id)
      if (index !== -1) {
        events.value[index] = response
      }

      // 更新當前事件 (如果是同一個)
      if (currentEvent.value && currentEvent.value.id === id) {
        currentEvent.value = response
      }

      return response
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '更新事件失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 刪除事件
  async function deleteEvent(id: number) {
    isLoading.value = true
    error.value = null

    try {
      await apiClient.deleteEvent(id)

      // 從本地事件列表中移除
      events.value = events.value.filter((event) => event.id !== id)

      // 清除當前事件 (如果是同一個)
      if (currentEvent.value && currentEvent.value.id === id) {
        currentEvent.value = null
      }
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '刪除事件失敗'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 添加參與者
  async function addAttendee(eventId: number, userId: number) {
    error.value = null

    try {
      await apiClient.addAttendee(eventId, userId)
      // 重新獲取事件詳情以更新參與者列表
      if (currentEvent.value && currentEvent.value.id === eventId) {
        await fetchEvent(eventId)
      }
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '添加參與者失敗'
      error.value = message
      throw err
    }
  }

  // 移除參與者
  async function removeAttendee(eventId: number, userId: number) {
    error.value = null

    try {
      await apiClient.removeAttendee(eventId, userId)
      // 重新獲取事件詳情以更新參與者列表
      if (currentEvent.value && currentEvent.value.id === eventId) {
        await fetchEvent(eventId)
      }
    } catch (err: unknown) {
      const message = (err as ApiError)?.response?.data?.message || '移除參與者失敗'
      error.value = message
      throw err
    }
  }

  // 清除錯誤
  function clearError() {
    error.value = null
  }

  // 清除當前事件
  function clearCurrentEvent() {
    currentEvent.value = null
  }

  return {
    events,
    currentEvent,
    isLoading,
    error,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    addAttendee,
    removeAttendee,
    clearError,
    clearCurrentEvent,
  }
})
