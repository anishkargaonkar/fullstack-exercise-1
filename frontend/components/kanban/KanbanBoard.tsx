'use client';

import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard() {
  const { tasksByStatus, loading, error, updateTask, deleteTask, refetch } = useTasks();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-sm text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Tasks</h3>
          <p className="text-gray-600">{error}</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50 min-h-0">
      <div className="grid grid-cols-4 gap-5 h-full min-h-[600px]">
        <KanbanColumn
          title="Pending"
          status="pending"
          tasks={tasksByStatus.pending}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
        <KanbanColumn
          title="In Progress"
          status="in_progress"
          tasks={tasksByStatus.in_progress}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
        <KanbanColumn
          title="Completed"
          status="completed"
          tasks={tasksByStatus.completed}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
        <KanbanColumn
          title="Launched"
          status="launched"
          tasks={tasksByStatus.launched}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}
