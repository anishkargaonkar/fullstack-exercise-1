import React, { useState } from 'react';
import type { Task, TaskStatus, TaskUpdate } from '../../lib/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: TaskUpdate) => Promise<Task | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  // Check if task is overdue (comparing dates without time)
  const isOverdue = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const createdDate = new Date(task.createdAt);
    createdDate.setHours(0, 0, 0, 0);

    return createdDate < today;
  })();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
      setMenuOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
    setStatusMenuOpen(false);
    setMenuOpen(false);
  };

  const statusOptions: { label: string; value: TaskStatus }[] = [
    { label: 'Pending', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'DONE' },
    { label: 'Launched', value: 'REVIEW' },
  ];

  // Mock assignees (since Task interface doesn't have assignees)
  const mockAssignees = ['Alice Johnson', 'Bob Smith'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer relative">
      {/* Header: Title and Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex-1 line-clamp-2">
          {task.title}
        </h3>

        {/* Three-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Task options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setMenuOpen(false);
                  setStatusMenuOpen(false);
                }}
              />

              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {/* Change Status submenu */}
                <div className="relative">
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    Change Status
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Status submenu */}
                  {statusMenuOpen && (
                    <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            task.status === option.value ? 'text-[#8B5CF6] font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Overdue label */}
      {isOverdue && (
        <div className="mb-3">
          <Badge variant="red">Overdue</Badge>
        </div>
      )}

      {/* Footer: Assignees, Priority, and Date */}
      <div className="flex items-center justify-between gap-2">
        {/* Assignee avatars */}
        <div className="flex -space-x-2">
          {mockAssignees.slice(0, 3).map((assignee, index) => (
            <div key={index} className="ring-2 ring-white">
              <Avatar name={assignee} size="sm" />
            </div>
          ))}
          {mockAssignees.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
              +{mockAssignees.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Priority flag */}
          {task.priority === 'HIGH' && (
            <div title="High Priority">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
              </svg>
            </div>
          )}

          {/* Due date */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
