'use client';

import React, { useState } from 'react';
import type { Task, TaskStatus, TaskUpdate } from '../../lib/types';
import { Avatar } from '../ui/Avatar';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, updates: TaskUpdate) => Promise<Task | null>;
  onDelete: (id: number) => Promise<boolean>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day} - ${hours}:${minutes}AM`;
  };

  const isOverdue = () => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date() && task.status !== 'completed' && task.status !== 'launched';
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    setMenuOpen(false);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
    setStatusMenuOpen(false);
    setMenuOpen(false);
  };

  const statusOptions: { label: string; value: TaskStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Launched', value: 'launched' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header: Title and Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex-1">
          {task.title}
        </h3>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setMenuOpen(false);
                  setStatusMenuOpen(false);
                }}
              />

              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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

                  {statusMenuOpen && (
                    <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            task.status === option.value ? 'text-purple-600 font-medium' : 'text-gray-700'
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

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <div className="flex -space-x-2 mb-3">
          {task.assignees.map((assignee, index) => (
            <div key={index} className="ring-2 ring-white rounded-full">
              <Avatar name={assignee} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Footer: Due date and Priority */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {task.due_date && (
            <span className={isOverdue() ? 'text-red-500 font-medium' : ''}>
              {formatDate(task.due_date)}
            </span>
          )}
          {isOverdue() && (
            <span className="ml-2 text-red-500 font-medium">Overdue</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <svg
            className={`w-4 h-4 ${task.priority === 'high' ? 'text-red-500' : 'text-blue-500'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
          </svg>
          <span className={`${task.priority === 'high' ? 'text-red-500' : 'text-blue-500'} font-medium`}>
            {task.priority === 'high' ? 'High' : 'Normal'} Priority
          </span>
        </div>
      </div>
    </div>
  );
}
