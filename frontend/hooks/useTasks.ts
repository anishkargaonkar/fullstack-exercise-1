'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskCreate, TaskUpdate, TasksByStatus } from '../lib/types';
import * as api from '../lib/api';

interface UseTasksReturn {
  tasks: Task[];
  tasksByStatus: TasksByStatus;
  loading: boolean;
  error: string | null;
  createTask: (task: TaskCreate) => Promise<Task | null>;
  updateTask: (id: number, updates: TaskUpdate) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<boolean>;
  refetch: () => Promise<void>;
}

function groupTasksByStatus(tasks: Task[]): TasksByStatus {
  return {
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed'),
    launched: tasks.filter(task => task.status === 'launched'),
  };
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tasksByStatus = groupTasksByStatus(tasks);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: TaskCreate): Promise<Task | null> => {
    try {
      const createdTask = await api.createTask(task);
      setTasks(prev => [...prev, createdTask]);
      return createdTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: number, updates: TaskUpdate): Promise<Task | null> => {
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );

    try {
      const updatedTask = await api.updateTask(id, updates);
      setTasks(prev =>
        prev.map(t => t.id === id ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      setTasks(previousTasks);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      return null;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    const previousTasks = tasks;

    // Optimistic delete
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await api.deleteTask(id);
      return true;
    } catch (err) {
      setTasks(previousTasks);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      return false;
    }
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
