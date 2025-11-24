import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '@/types'
import router from '@/router' // 引入 Vue Router 實例

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    // 請求攔截器 - 自動添加 JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // 響應攔截器 - 處理錯誤和 token 過期
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token 過期或無效，清除本地存儲
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          // 檢查當前路由是否已經是 /login，避免重複跳轉
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login')
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // 認證相關 API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials)
    return response.data
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', userData)
    return response.data
  }

  // 事件相關 API
  async getEvents(): Promise<Event[]> {
    const response = await this.client.get<Event[]>('/events')
    return response.data
  }

  async getEvent(id: number): Promise<Event> {
    const response = await this.client.get<Event>(`/events/${id}`)
    return response.data
  }

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    console.log('API BODY', eventData)
    const response = await this.client.post('/events', eventData)
    return response.data
  }

  async updateEvent(id: number, eventData: UpdateEventRequest): Promise<Event> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.client.put(
      `/events/${id}`,
      eventData,
    )
    return response.data.data!
  }

  async deleteEvent(id: number): Promise<void> {
    await this.client.delete(`/events/${id}`)
  }

  // 參與者相關 API
  async addAttendee(eventId: number, userId: number): Promise<void> {
    await this.client.post(`/events/${eventId}/attendees/${userId}`)
  }

  async removeAttendee(eventId: number, userId: number): Promise<void> {
    await this.client.delete(`/events/${eventId}/attendees/${userId}`)
  }
}

export const apiClient = new ApiClient()
export default apiClient
