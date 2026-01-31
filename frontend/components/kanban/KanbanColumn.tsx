'use client';

import React from 'react';
import type { Task, TaskStatus, TaskUpdate } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onUpdate: (id: number, updates: TaskUpdate) => Promise<Task | null>;
  onDelete: (id: number) => Promise<boolean>;
}

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-gray-400',
  in_progress: 'bg-yellow-400',
  completed: 'bg-green-500',
  launched: 'bg-purple-500',
};

export function KanbanColumn({ title, status, tasks, onUpdate, onDelete }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      {/* Column Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
        <button className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
