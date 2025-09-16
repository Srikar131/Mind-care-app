export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your mental health dashboard
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start a Chat Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Talk with your AI companion
          </p>
          <button className="btn-primary">
            Start Chat
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Write in Journal
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Record your thoughts and feelings
          </p>
          <button className="btn-primary">
            New Entry
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Log Your Mood
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track how you're feeling today
          </p>
          <button className="btn-primary">
            Log Mood
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Chat Sessions</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">7.2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Mood</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  )
}