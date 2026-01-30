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
  devLogin: (role?: UserRole, userId?: string) => void
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
      devLogin: (role: UserRole = UserRole.ADMIN, userId?: string) => {
        const now = new Date().toISOString()
        
        // 根据角色和userId生成不同的用户信息
        const userProfiles: Record<string, any> = {
          'investor-inst-001': {
            id: 'investor-inst-001',
            name: '水珠资本管理有限公司',
            email: 'shuizhu@capital.com',
            phone: '021-68886666',
            role: UserRole.INVESTOR,
          },
          'investor-inst-004': {
            id: 'investor-inst-004',
            name: '露珠资本有限合伙',
            email: 'luzhu@capital.com',
            phone: '010-59886677',
            role: UserRole.INVESTOR,
          },
          [UserRole.PROJECT_OWNER]: {
            id: 'project-owner-001',
            name: '华娱文化传媒集团',
            email: 'concert@operator.com',
            phone: '010-84568888',
            role: UserRole.PROJECT_OWNER,
          },
          [UserRole.ADMIN]: {
            id: 'admin-001',
            name: '湖畔通平台管理员',
            email: 'admin@lakeside.com',
            phone: '400-888-6666',
            role: UserRole.ADMIN,
          },
        }
        
        // 如果指定了userId，使用该用户；否则根据role获取默认用户
        let profile
        if (userId) {
          profile = userProfiles[userId]
        } else {
          // 默认投资人是水珠资本
          profile = role === UserRole.INVESTOR 
            ? userProfiles['investor-inst-001']
            : userProfiles[role]
        }
        
        const devUser: User = {
          ...profile,
          createdAt: now,
          updatedAt: now,
        }
        const devToken = `dev-token-${profile.id}-${Date.now()}`
        
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
