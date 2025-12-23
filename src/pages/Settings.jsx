import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { categories, labels, addCategory, addLabel, updateLabel, deleteLabel, clearNotifications } = useTask();
  const { isDark, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [newCategory, setNewCategory] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6');
  const [editingLabel, setEditingLabel] = useState(null);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      addLabel(newLabelName.trim(), newLabelColor);
      setNewLabelName('');
      setNewLabelColor('#3b82f6');
    }
  };

  const handleUpdateLabel = (id) => {
    if (editingLabel) {
      updateLabel(id, editingLabel);
      setEditingLabel(null);
    }
  };

  const handleExportData = () => {
    const data = {
      tasks: localStorage.getItem(`tasks_${user.email}`),
      archived: localStorage.getItem(`archived_${user.email}`),
      history: localStorage.getItem(`history_${user.email}`),
      categories: localStorage.getItem(`categories_${user.email}`),
      labels: localStorage.getItem(`labels_${user.email}`),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem(`tasks_${user.email}`);
      localStorage.removeItem(`archived_${user.email}`);
      localStorage.removeItem(`history_${user.email}`);
      clearNotifications();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'categories', name: 'Categories', icon: '📁' },
    { id: 'labels', name: 'Labels', icon: '🏷️' },
    { id: 'data', name: 'Data Management', icon: '💾' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Profile information is read-only. Contact support to update your information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                        isDark ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                          isDark ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Categories</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add New Category
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      placeholder="Enter category name"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Existing Categories</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-center font-medium"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'labels' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Labels</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add New Label
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
                      placeholder="Label name"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="color"
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={handleAddLabel}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Existing Labels</h3>
                  <div className="space-y-2">
                    {labels.map((label) => (
                      <div
                        key={label.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: label.color }}
                        ></div>
                        <span className="flex-1 text-gray-900 dark:text-white font-medium">
                          {label.name}
                        </span>
                        <button
                          onClick={() => deleteLabel(label.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Export Data</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Download all your tasks, categories, and settings as a JSON file.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                      Export Data
                    </button>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Clear Notifications</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Remove all notifications from your notification center.
                    </p>
                    <button
                      onClick={clearNotifications}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition font-medium"
                    >
                      Clear Notifications
                    </button>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Clear All Data</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Permanently delete all your tasks, categories, and settings. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleClearAllData}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
