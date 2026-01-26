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
  devLogin: (role?: UserRole) => void
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

      // 开发模式：快速登录（支持三种角色）
      devLogin: (role: UserRole = UserRole.ADMIN) => {
        const now = new Date().toISOString()
        
        // 根据角色生成不同的用户信息
        const userProfiles = {
          [UserRole.INVESTOR]: {
            id: 'investor-inst-001',
            name: '水珠资本管理有限公司',
            email: 'shuizhu@capital.com',
            phone: '021-68886666',
          },
          [UserRole.PROJECT_OWNER]: {
            id: 'project-owner-001',
            name: '华娱文化传媒集团',
            email: 'concert@operator.com',
            phone: '010-84568888',
          },
          [UserRole.ADMIN]: {
            id: 'admin-001',
            name: 'MIFC 平台管理员',
            email: 'admin@mifc.com',
            phone: '400-888-6666',
          },
        }
        
        const profile = userProfiles[role]
        const devUser: User = {
          ...profile,
          role,
          createdAt: now,
          updatedAt: now,
        }
        const devToken = `dev-token-${role}-${Date.now()}`
        
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
