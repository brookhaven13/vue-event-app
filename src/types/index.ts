// API Types
export interface User {
  id: number
  username: string
  email: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  organizer_id: number
  organizer?: User
  attendees?: User[]
  created_at?: string
  updated_at?: string
}

export interface CreateEventRequest {
  title: string
  description: string
  date: string
  location: string
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  date?: string
  location?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

// Store Types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface EventState {
  events: Event[]
  currentEvent: Event | null
  isLoading: boolean
  error: string | null
}
