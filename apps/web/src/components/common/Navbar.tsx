import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  BellIcon, 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/app'
import { useAuthStore } from '@/store/auth'
import clsx from 'clsx'

export default function Navbar() {
  const { toggleSidebar, theme, setTheme } = useAppStore()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    // The app will redirect to login page due to ProtectedRoute
  }

  const themeOptions = [
    { value: 'light', icon: SunIcon, label: 'Light' },
    { value: 'dark', icon: MoonIcon, label: 'Dark' },
    { value: 'system', icon: ComputerDesktopIcon, label: 'System' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white lg:ml-0">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
              {theme === 'light' && <SunIcon className="w-5 h-5" />}
              {theme === 'dark' && <MoonIcon className="w-5 h-5" />}
              {theme === 'system' && <ComputerDesktopIcon className="w-5 h-5" />}
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {themeOptions.map((option) => (
                    <Menu.Item key={option.value}>
                      {({ active }) => (
                        <button
                          onClick={() => setTheme(option.value as any)}
                          className={clsx(
                            'flex items-center w-full px-4 py-2 text-sm',
                            active 
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300',
                            theme === option.value && 'font-medium'
                          )}
                        >
                          <option.icon className="w-4 h-4 mr-3" />
                          {option.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
            <BellIcon className="w-5 h-5" />
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          active 
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  )
}