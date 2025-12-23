import { useState, useEffect, useRef } from 'react';
import { useTask } from '../contexts/TaskContext';

const Productivity = () => {
  const { getProductivityStats, tasks } = useTask();
  const stats = getProductivityStats();

  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef(null);

  // Daily Goals State
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 5;
  });
  const [dailyGoalInput, setDailyGoalInput] = useState(dailyGoal);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    if (timerMode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      // Play notification sound (you would add an audio file)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: 'Time for a break!',
          icon: '/favicon.ico'
        });
      }

      if (newCount % 4 === 0) {
        setTimerMode('longBreak');
        setPomodoroTime(15 * 60);
      } else {
        setTimerMode('shortBreak');
        setPomodoroTime(5 * 60);
      }
    } else {
      setTimerMode('work');
      setPomodoroTime(25 * 60);
    }
  };

  const startTimer = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'work') {
      setPomodoroTime(25 * 60);
    } else if (timerMode === 'shortBreak') {
      setPomodoroTime(5 * 60);
    } else {
      setPomodoroTime(15 * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateDailyGoal = () => {
    setDailyGoal(dailyGoalInput);
    localStorage.setItem('dailyGoal', dailyGoalInput.toString());
  };

  const goalProgress = Math.min((stats.tasksCompletedToday / dailyGoal) * 100, 100);

  const getModeColor = () => {
    switch (timerMode) {
      case 'work':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getModeText = () => {
    switch (timerMode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return '';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Productivity Tools</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pomodoro Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🍅 Pomodoro Timer</h2>
          
          <div className="text-center mb-6">
            <div className={`inline-block px-4 py-2 ${getModeColor()} text-white rounded-full mb-4 font-medium`}>
              {getModeText()}
            </div>
            <div className="text-7xl font-bold text-gray-900 dark:text-white mb-4">
              {formatTime(pomodoroTime)}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Completed Pomodoros: <span className="font-bold">{pomodoroCount}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-4">
            {!isTimerRunning ? (
              <button
                onClick={startTimer}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition font-medium text-lg"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium text-lg"
            >
              Reset
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>🔴 Focus: 25 minutes</p>
              <p>🟢 Short Break: 5 minutes</p>
              <p>🔵 Long Break: 15 minutes (after 4 pomodoros)</p>
            </div>
          </div>
        </div>

        {/* Daily Goal Tracker */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎯 Daily Goal</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Tasks Completed Today
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.tasksCompletedToday} / {dailyGoal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {goalProgress >= 100 ? '🎉 Goal achieved!' : `${Math.round(goalProgress)}% complete`}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Set Daily Goal
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="50"
                value={dailyGoalInput}
                onChange={(e) => setDailyGoalInput(parseInt(e.target.value) || 1)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={updateDailyGoal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                Update
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">This Week</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats.tasksCompletedThisWeek} tasks</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Time Tracked</span>
              <span className="font-bold text-gray-900 dark:text-white">{Math.round(stats.totalTimeSpent / 60)}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Avg Time per Task</span>
              <span className="font-bold text-gray-900 dark:text-white">{Math.round(stats.avgTimePerTask)} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Tasks</p>
              <p className="text-4xl font-bold mt-2">
                {tasks.filter(t => t.status !== 'Done').length}
              </p>
            </div>
            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completion Rate</p>
              <p className="text-4xl font-bold mt-2">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0}%
              </p>
            </div>
            <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Focus Sessions</p>
              <p className="text-4xl font-bold mt-2">{pomodoroCount}</p>
            </div>
            <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
