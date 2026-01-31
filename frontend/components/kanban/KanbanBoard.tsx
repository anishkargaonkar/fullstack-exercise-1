import React from 'react';
import type { TaskStatus } from '../../lib/types';
import { useTasks } from '../../hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC = () => {
  const { tasksByStatus, loading, error, updateTask, deleteTask } = useTasks();

  // Column configuration
  const columns: Array<{
    title: string;
    status: TaskStatus;
  }> = [
    { title: 'Pending', status: 'TODO' },
    { title: 'In Progress', status: 'IN_PROGRESS' },
    { title: 'Completed', status: 'DONE' },
    { title: 'Launched', status: 'REVIEW' },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
          <p className="mt-4 text-sm text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tasks</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main Kanban board
  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={tasksByStatus[column.status]}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};
