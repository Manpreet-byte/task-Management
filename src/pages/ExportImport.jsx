import { useState, useRef } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';

const ExportImport = () => {
  const { tasks, addTask } = useTask();
  const { user } = useAuth();
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  const exportToJSON = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${user.email}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Categories', 'Created At'];
    const rows = tasks.map(task => [
      task.title,
      task.description,
      task.status,
      task.priority || 'Medium',
      task.dueDate || '',
      (task.categories || []).join('; '),
      new Date(task.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${user.email}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let importedTasks = [];

        if (file.name.endsWith('.json')) {
          importedTasks = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
            
            importedTasks.push({
              title: values[0],
              description: values[1],
              status: values[2],
              priority: values[3] || 'Medium',
              dueDate: values[4] || null,
              categories: values[5] ? values[5].split('; ') : []
            });
          }
        }

        if (Array.isArray(importedTasks) && importedTasks.length > 0) {
          importedTasks.forEach(task => {
            const { id, createdAt, updatedAt, comments, attachments, ...taskData } = task;
            addTask(taskData);
          });
          setImportStatus(`Successfully imported ${importedTasks.length} tasks!`);
        } else {
          setImportStatus('No valid tasks found in file');
        }
      } catch (error) {
        setImportStatus(`Error importing file: ${error.message}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Export / Import Tasks</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Tasks</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Export your tasks to backup or transfer them to another device. You can export in JSON or CSV format.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Currently tracking</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{tasks.length} tasks</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportToJSON}
              disabled={tasks.length === 0}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as JSON
            </button>
            <button
              onClick={exportToCSV}
              disabled={tasks.length === 0}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as CSV
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import Tasks</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Import tasks from a previously exported file. Supports both JSON and CSV formats.
          </p>

          {importStatus && (
            <div className={`mb-4 p-4 rounded-lg ${
              importStatus.includes('Error') || importStatus.includes('No valid')
                ? 'bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-200'
            }`}>
              {importStatus}
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-yellow-900 dark:text-yellow-200">
                <p className="font-semibold mb-1">Important</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Imported tasks will be added to your existing tasks</li>
                  <li>Duplicate tasks may be created</li>
                  <li>File must be JSON or CSV format</li>
                </ul>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Choose File to Import
          </button>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supported Formats:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span><strong>JSON:</strong> Full task data with all fields</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span><strong>CSV:</strong> Basic task data (title, description, status, etc.)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
