// API Types
export interface User {
  id: number
  name: string
  email: string
}

export interface Event {
  id: number
  name: string
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
  owner_id: number
  name: string
  description: string
  date: string
  location: string
}

export interface UpdateEventRequest {
  name?: string
  description?: string
  date?: string
  location?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
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
