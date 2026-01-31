import React from 'react';
import type { Task, TaskStatus, TaskUpdate } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onUpdate: (id: string, updates: TaskUpdate) => Promise<Task | null>;
  onDelete: (id: string) => Promise<boolean>;
}

// Status indicator colors
const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-400',
  IN_PROGRESS: 'bg-yellow-400',
  DONE: 'bg-green-500',
  REVIEW: 'bg-purple-500',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onUpdate,
  onDelete,
}) => {
  const dotColor = statusColors[status];

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      {/* Column Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
        {/* Status indicator dot */}
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />

        {/* Title */}
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>

        {/* Task count */}
        <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
};
