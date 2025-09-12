import { Outlet } from 'react-router-dom'
import Navbar from './common/Navbar'
import Sidebar from './common/Sidebar'
import { useAppStore } from '@/store/app'

export default function Layout() {
  const { isSidebarOpen } = useAppStore()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}