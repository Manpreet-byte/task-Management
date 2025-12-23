import { useTask } from '../contexts/TaskContext';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { duplicateTask, archiveTask, labels } = useTask();
  
  const statusColors = {
    'To Do': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'In Progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'Done': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  };

  const priorityColors = {
    'High': 'text-red-600 dark:text-red-400',
    'Medium': 'text-orange-600 dark:text-orange-400',
    'Low': 'text-green-600 dark:text-green-400'
  };

  const priorityBadgeColors = {
    'High': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    'Medium': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    'Low': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4" style={{ borderLeftColor: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#ea580c' : '#16a34a' }}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex-1">{task.title}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityBadgeColors[task.priority || 'Medium']}`}>
            {task.priority || 'Medium'}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">{task.description}</p>
      
      {task.categories && task.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.categories.map((category, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
              {category}
            </span>
          ))}
        </div>
      )}

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((labelId) => {
            const label = labels.find(l => l.id === labelId);
            return label ? (
              <span
                key={labelId}
                className="px-2 py-1 rounded text-xs text-white font-medium"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ) : null;
          })}
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {task.dueDate && (
        <div className={`flex items-center gap-1 mb-3 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{isOverdue ? 'Overdue: ' : 'Due: '}{formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => duplicateTask(task.id)}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm font-medium"
          title="Duplicate"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => archiveTask(task.id)}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          title="Archive"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
