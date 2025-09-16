export default function ChatPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Chat with your AI companion
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            I'm here to listen and support you
          </p>
        </div>

        <div className="flex-1 p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Chat functionality will be implemented soon
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 input-field"
            />
            <button className="btn-primary">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}