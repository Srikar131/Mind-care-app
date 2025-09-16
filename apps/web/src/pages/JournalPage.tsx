export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal space for reflection
          </p>
        </div>
        <button className="btn-primary">
          New Entry
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Journal functionality will be implemented soon
        </div>
      </div>
    </div>
  )
}