import { useState } from 'react';
import { useTask } from '../contexts/TaskContext';

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const { addComment, addAttachment } = useTask();
  const [newComment, setNewComment] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  if (!isOpen || !task) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      addAttachment(task.id, {
        id: Date.now().toString(),
        name: attachmentName.trim(),
        addedAt: new Date().toISOString()
      });
      setAttachmentName('');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{task.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                task.status === 'Done' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
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
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">DESCRIPTION</h3>
            <p className="text-gray-600 dark:text-gray-400">{task.description || 'No description provided'}</p>
          </div>

          {task.dueDate && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">DUE DATE</h3>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>
          )}

          {task.categories && task.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CATEGORIES</h3>
              <div className="flex flex-wrap gap-2">
                {task.categories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">ATTACHMENTS</h3>
            {task.attachments && task.attachments.length > 0 ? (
              <div className="space-y-2 mb-3">
                {task.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{attachment.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Added {formatDate(attachment.addedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No attachments</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Attachment name (e.g., design.pdf)"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAttachment()}
              />
              <button
                onClick={handleAddAttachment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">COMMENTS</h3>
            {task.comments && task.comments.length > 0 ? (
              <div className="space-y-3 mb-3">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-900 dark:text-white mb-1">{comment.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.timestamp)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No comments yet</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
              >
                Comment
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(task.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(task.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
