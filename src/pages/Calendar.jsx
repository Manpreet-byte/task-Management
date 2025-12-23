import { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import TaskDetailModal from '../components/TaskDetailModal';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, firstDay, lastDay };
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50 dark:bg-gray-900 p-2 min-h-[100px]"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          className={`bg-white dark:bg-gray-800 p-2 min-h-[100px] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition ${
            isToday ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map(task => {
              const isOverdue = new Date(task.dueDate) < today && task.status !== 'Done';
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                    task.status === 'Done'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : isOverdue
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                </div>
              );
            })}
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return weekDays.map((date, index) => {
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === today.toDateString();

      return (
        <div
          key={index}
          className={`flex-1 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 ${
            isToday ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
              {date.getDate()}
            </div>
          </div>
          <div className="space-y-2">
            {dayTasks.map(task => {
              const isOverdue = new Date(task.dueDate) < today && task.status !== 'Done';
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-2 rounded cursor-pointer hover:opacity-80 ${
                    task.status === 'Done'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : isOverdue
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}
                >
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="text-xs opacity-75">{task.priority}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Calendar</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => viewMode === 'month' ? changeMonth(-1) : changeWeek(-1)}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              Today
            </button>
            
            <button
              onClick={() => viewMode === 'month' ? changeMonth(1) : changeWeek(1)}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderMonthView()}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex h-full">
            {renderWeekView()}
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
