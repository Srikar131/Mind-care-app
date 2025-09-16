import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  isSidebarOpen: boolean
  isLoading: boolean
  error: string | null
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  isSidebarOpen: false,
  isLoading: false,
  error: null,
  setTheme: (theme) => {
    set({ theme })
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))