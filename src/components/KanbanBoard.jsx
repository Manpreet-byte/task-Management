import { useState } from 'react';
import { useTask } from '../contexts/TaskContext';

const KanbanBoard = () => {
  const { tasks, updateTask } = useTask();
  const [draggedTask, setDraggedTask] = useState(null);

  const statuses = ['To Do', 'In Progress', 'Done'];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (status) => {
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
    }
    setDraggedTask(null);
  };

  const statusColors = {
    'To Do': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'In Progress': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    'Done': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  };

  const headerColors = {
    'To Do': 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100',
    'In Progress': 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100',
    'Done': 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statuses.map((status) => (
        <div
          key={status}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(status)}
          className={`rounded-lg border-2 ${statusColors[status]} p-4 min-h-[500px]`}
        >
          <h3 className={`text-lg font-bold mb-4 px-3 py-2 rounded ${headerColors[status]}`}>
            {status} ({getTasksByStatus(status).length})
          </h3>
          
          <div className="space-y-3">
            {getTasksByStatus(status).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-move hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
