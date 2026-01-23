import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '@/types'
import { apiClient } from '@/services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<void>
  devLogin: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials: LoginRequest) => {
        set({ loading: true })
        try {
          const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
          const { token, user } = response

          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true })
        try {
          const response = await apiClient.post<AuthResponse>('/auth/register', data)
          const { token, user } = response

          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      fetchCurrentUser: async () => {
        try {
          const user = await apiClient.get<User>('/auth/me')
          set({ user, isAuthenticated: true })
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false })
          localStorage.removeItem('token')
        }
      },

      // 开发模式：跳过登录直接进入系统
      devLogin: () => {
        const now = new Date().toISOString()
        const devUser: User = {
          id: 'dev-admin-001',
          name: '开发管理员',
          email: 'admin@dev.local',
          role: UserRole.ADMIN,
          phone: '13800138000',
          createdAt: now,
          updatedAt: now,
        }
        const devToken = 'dev-token-' + Date.now()
        
        localStorage.setItem('token', devToken)
        set({
          user: devUser,
          token: devToken,
          isAuthenticated: true,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
