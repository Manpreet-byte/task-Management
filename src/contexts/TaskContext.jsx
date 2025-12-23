import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [categories, setCategories] = useState(['Work', 'Personal', 'Shopping', 'Health', 'Education']);
  const [labels, setLabels] = useState([
    { id: '1', name: 'Bug', color: '#ef4444' },
    { id: '2', name: 'Feature', color: '#3b82f6' },
    { id: '3', name: 'Improvement', color: '#10b981' },
    { id: '4', name: 'Urgent', color: '#f59e0b' }
  ]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.email}`);
      const storedArchived = localStorage.getItem(`archived_${user.email}`);
      const storedHistory = localStorage.getItem(`history_${user.email}`);
      const storedCategories = localStorage.getItem(`categories_${user.email}`);
      const storedLabels = localStorage.getItem(`labels_${user.email}`);
      const storedTeamMembers = localStorage.getItem(`team_${user.email}`);
      const storedTemplates = localStorage.getItem(`templates_${user.email}`);
      const storedNotifications = localStorage.getItem(`notifications_${user.email}`);
      
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedArchived) setArchivedTasks(JSON.parse(storedArchived));
      if (storedHistory) setTaskHistory(JSON.parse(storedHistory));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedLabels) setLabels(JSON.parse(storedLabels));
      if (storedTeamMembers) setTeamMembers(JSON.parse(storedTeamMembers));
      if (storedTemplates) setTaskTemplates(JSON.parse(storedTemplates));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    }
  }, [user]);

  useEffect(() => {
    if (user && tasks.length >= 0) {
      localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`archived_${user.email}`, JSON.stringify(archivedTasks));
      localStorage.setItem(`history_${user.email}`, JSON.stringify(taskHistory));
      localStorage.setItem(`categories_${user.email}`, JSON.stringify(categories));
      localStorage.setItem(`labels_${user.email}`, JSON.stringify(labels));
      localStorage.setItem(`team_${user.email}`, JSON.stringify(teamMembers));
      localStorage.setItem(`templates_${user.email}`, JSON.stringify(taskTemplates));
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(notifications));
    }
  }, [archivedTasks, taskHistory, categories, labels, teamMembers, taskTemplates, notifications, user]);

  const addToHistory = (action, taskData) => {
    const historyEntry = {
      id: Date.now().toString(),
      action,
      task: taskData,
      timestamp: new Date().toISOString()
    };
    setTaskHistory([historyEntry, ...taskHistory.slice(0, 49)]);
  };

  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || null,
      categories: task.categories || [],
      labels: task.labels || [],
      assignedTo: task.assignedTo || [],
      subtasks: task.subtasks || [],
      dependencies: task.dependencies || [],
      estimatedTime: task.estimatedTime || null,
      timeSpent: task.timeSpent || 0,
      isRecurring: task.isRecurring || false,
      recurringPattern: task.recurringPattern || null,
      comments: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    addToHistory('created', newTask);
    addNotification(`Task "${newTask.title}" created successfully`, 'success');
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } : task
    ));
    addToHistory('updated', { id, ...updatedTask });
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    addToHistory('deleted', taskToDelete);
  };

  const duplicateTask = (id) => {
    const taskToDuplicate = tasks.find(task => task.id === id);
    if (taskToDuplicate) {
      const duplicated = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        title: `${taskToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks([...tasks, duplicated]);
      addToHistory('duplicated', duplicated);
    }
  };

  const archiveTask = (id) => {
    const taskToArchive = tasks.find(task => task.id === id);
    if (taskToArchive) {
      setArchivedTasks([...archivedTasks, { ...taskToArchive, archivedAt: new Date().toISOString() }]);
      setTasks(tasks.filter(task => task.id !== id));
      addToHistory('archived', taskToArchive);
    }
  };

  const restoreTask = (id) => {
    const taskToRestore = archivedTasks.find(task => task.id === id);
    if (taskToRestore) {
      const { archivedAt, ...task } = taskToRestore;
      setTasks([...tasks, task]);
      setArchivedTasks(archivedTasks.filter(task => task.id !== id));
      addToHistory('restored', task);
    }
  };

  const bulkDelete = (ids) => {
    const tasksToDelete = tasks.filter(task => ids.includes(task.id));
    setTasks(tasks.filter(task => !ids.includes(task.id)));
    addToHistory('bulk_deleted', { count: ids.length, tasks: tasksToDelete });
  };

  const addComment = (taskId, comment) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newComment = {
          id: Date.now().toString(),
          text: comment,
          timestamp: new Date().toISOString()
        };
        return { ...task, comments: [...(task.comments || []), newComment] };
      }
      return task;
    }));
  };

  const addAttachment = (taskId, attachment) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, attachments: [...(task.attachments || []), attachment] };
      }
      return task;
    }));
  };

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done');
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const overdue = getOverdueTasks().length;
    const highPriority = tasks.filter(t => t.priority === 'High').length;

    return { total, completed, inProgress, todo, overdue, highPriority };
  };

  // Notification Management
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([notification, ...notifications.slice(0, 49)]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Label Management
  const addLabel = (name, color) => {
    const newLabel = {
      id: Date.now().toString(),
      name,
      color: color || '#3b82f6'
    };
    setLabels([...labels, newLabel]);
  };

  const updateLabel = (id, updates) => {
    setLabels(labels.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLabel = (id) => {
    setLabels(labels.filter(l => l.id !== id));
    setTasks(tasks.map(task => ({
      ...task,
      labels: (task.labels || []).filter(labelId => labelId !== id)
    })));
  };

  // Team Member Management
  const addTeamMember = (member) => {
    const newMember = {
      id: Date.now().toString(),
      ...member,
      addedAt: new Date().toISOString()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  // Task Template Management
  const saveAsTemplate = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const template = {
        id: Date.now().toString(),
        name: task.title,
        ...task,
        createdAt: new Date().toISOString()
      };
      setTaskTemplates([...taskTemplates, template]);
      addNotification('Template saved successfully', 'success');
    }
  };

  const createFromTemplate = (templateId) => {
    const template = taskTemplates.find(t => t.id === templateId);
    if (template) {
      const { id, createdAt, updatedAt, ...templateData } = template;
      addTask(templateData);
    }
  };

  const deleteTemplate = (id) => {
    setTaskTemplates(taskTemplates.filter(t => t.id !== id));
  };

  // Subtask Management
  const addSubtask = (taskId, subtaskTitle) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newSubtask = {
          id: Date.now().toString(),
          title: subtaskTitle,
          completed: false,
          createdAt: new Date().toISOString()
        };
        return { ...task, subtasks: [...(task.subtasks || []), newSubtask] };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const subtasks = (task.subtasks || []).map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...task, subtasks };
      }
      return task;
    }));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, subtasks: (task.subtasks || []).filter(st => st.id !== subtaskId) };
      }
      return task;
    }));
  };

  // Time Tracking
  const addTimeEntry = (taskId, minutes) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, timeSpent: (task.timeSpent || 0) + minutes };
      }
      return task;
    }));
  };

  // Search and Filter
  const searchTasks = (query, filters = {}) => {
    return tasks.filter(task => {
      const matchesQuery = !query || 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesStatus = !filters.status || filters.status === 'All' || task.status === filters.status;
      const matchesPriority = !filters.priority || filters.priority === 'All' || task.priority === filters.priority;
      const matchesCategory = !filters.category || filters.category === 'All' || 
        (task.categories && task.categories.includes(filters.category));
      const matchesLabel = !filters.label || 
        (task.labels && task.labels.includes(filters.label));
      const matchesAssignee = !filters.assignee || 
        (task.assignedTo && task.assignedTo.includes(filters.assignee));

      return matchesQuery && matchesStatus && matchesPriority && matchesCategory && matchesLabel && matchesAssignee;
    });
  };

  // Productivity Insights
  const getProductivityStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tasksCompletedToday = tasks.filter(t => {
      if (t.status === 'Done' && t.updatedAt) {
        const updatedDate = new Date(t.updatedAt);
        updatedDate.setHours(0, 0, 0, 0);
        return updatedDate.getTime() === today.getTime();
      }
      return false;
    }).length;

    const tasksCompletedThisWeek = tasks.filter(t => {
      if (t.status === 'Done' && t.updatedAt) {
        const updatedDate = new Date(t.updatedAt);
        return updatedDate >= weekAgo;
      }
      return false;
    }).length;

    const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    const avgTimePerTask = tasks.length > 0 ? totalTimeSpent / tasks.length : 0;

    return {
      tasksCompletedToday,
      tasksCompletedThisWeek,
      totalTimeSpent,
      avgTimePerTask
    };
  };

  const value = {
    tasks,
    archivedTasks,
    taskHistory,
    categories,
    labels,
    teamMembers,
    taskTemplates,
    notifications,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    archiveTask,
    restoreTask,
    bulkDelete,
    addComment,
    addAttachment,
    addCategory,
    getTasksByStatus,
    getOverdueTasks,
    getTaskStats,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    addLabel,
    updateLabel,
    deleteLabel,
    addTeamMember,
    removeTeamMember,
    saveAsTemplate,
    createFromTemplate,
    deleteTemplate,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addTimeEntry,
    searchTasks,
    getProductivityStats
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
