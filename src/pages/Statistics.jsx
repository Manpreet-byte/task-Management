import { useTask } from '../contexts/TaskContext';

const Statistics = () => {
  const { tasks, getOverdueTasks, getTaskStats } = useTask();
  const stats = getTaskStats();
  const overdueTasks = getOverdueTasks();

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const priorityBreakdown = {
    high: tasks.filter(t => t.priority === 'High').length,
    medium: tasks.filter(t => t.priority === 'Medium').length,
    low: tasks.filter(t => t.priority === 'Low').length
  };

  const recentActivity = tasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const categoryStats = {};
  tasks.forEach(task => {
    if (task.categories) {
      task.categories.forEach(cat => {
        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
      });
    }
  });

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('600', '100')} ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Statistics & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="border-blue-600"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          color="border-green-600"
          subtitle={`${completionRate}% completion rate`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="border-blue-600"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          color="border-red-600"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Priority Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">High Priority</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{priorityBreakdown.high}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.high / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Medium Priority</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{priorityBreakdown.medium}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.medium / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Low Priority</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{priorityBreakdown.low}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (priorityBreakdown.low / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Status Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">To Do</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{stats.todo}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.todo / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">In Progress</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{stats.inProgress}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Done</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold">{stats.completed}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(categoryStats).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tasks by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{count}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Done' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
