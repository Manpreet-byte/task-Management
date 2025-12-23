import { useTask } from '../contexts/TaskContext';

const Archive = () => {
  const { archivedTasks, restoreTask, deleteTask } = useTask();

  const handleRestore = (id) => {
    restoreTask(id);
  };

  const handlePermanentDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      deleteTask(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Archived Tasks</h1>

      {archivedTasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No archived tasks</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Archive tasks to keep your workspace organized</p>
        </div>
      ) : (
        <div className="space-y-4">
          {archivedTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      task.priority === 'Medium' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                  {task.categories && task.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {task.categories.map((category, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Archived: {formatDate(task.archivedAt)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleRestore(task.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(task.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
