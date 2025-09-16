import api from './api'
import type { User, LoginCredentials, RegisterCredentials } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials) {
    const response = await api.post('/auth/register', credentials)
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
  },

  async refresh() {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot', { email })
    return response.data
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post('/auth/reset', { token, password })
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user/me')
    return response.data
  },

  async updateProfile(userData: Partial<User>) {
    const response = await api.patch('/user/me', userData)
    return response.data
  },

  async deleteAccount() {
    await api.delete('/user/me')
  },
}