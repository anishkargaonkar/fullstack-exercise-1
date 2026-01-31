/**
 * Custom React hook for task data management with optimistic updates
 * Provides CRUD operations and state management for tasks
 */

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskCreate, TaskUpdate, TasksByStatus, TaskStatus } from '../lib/types';
import * as api from '../lib/api';

/**
 * Hook state interface
 */
interface UseTasksState {
  tasks: Task[];
  tasksByStatus: TasksByStatus;
  loading: boolean;
  error: string | null;
}

/**
 * Hook return interface
 */
interface UseTasksReturn extends UseTasksState {
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskCreate) => Promise<Task | null>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Helper function to group tasks by their status
 * @param tasks - Array of tasks to group
 * @returns Tasks organized by status for Kanban columns
 */
function groupTasksByStatus(tasks: Task[]): TasksByStatus {
  return {
    TODO: tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    REVIEW: tasks.filter(task => task.status === 'REVIEW'),
    DONE: tasks.filter(task => task.status === 'DONE'),
  };
}

/**
 * Custom hook for task management with optimistic updates
 *
 * Features:
 * - Automatic data fetching on mount
 * - Tasks grouped by status for Kanban display
 * - Optimistic updates for better UX
 * - Automatic revert on API errors
 * - Centralized error handling
 *
 * @returns Object containing tasks state and CRUD operations
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state: tasks grouped by status
  const tasksByStatus = groupTasksByStatus(tasks);

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new task with optimistic update
   * @param task - Task data to create
   * @returns Created task or null on error
   */
  const createTask = useCallback(async (task: TaskCreate): Promise<Task | null> => {
    // Create optimistic task with temporary ID
    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store previous state for rollback
    const previousTasks = tasks;

    // Optimistic update
    setTasks(prev => [...prev, optimisticTask]);
    setError(null);

    try {
      // Make API call
      const createdTask = await api.createTask(task);

      // Replace optimistic task with real one
      setTasks(prev =>
        prev.map(t => t.id === optimisticTask.id ? createdTask : t)
      );

      return createdTask;
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Error creating task:', err);
      return null;
    }
  }, [tasks]);

  /**
   * Update an existing task with optimistic update
   * @param id - Task ID to update
   * @param updates - Partial task data to update
   * @returns Updated task or null on error
   */
  const updateTask = useCallback(async (id: string, updates: TaskUpdate): Promise<Task | null> => {
    // Store previous state for rollback
    const previousTasks = tasks;

    // Find the task to update
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) {
      setError('Task not found');
      return null;
    }

    // Create optimistic updated task
    const optimisticTask: Task = {
      ...taskToUpdate,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === id ? optimisticTask : t)
    );
    setError(null);

    try {
      // Make API call
      const updatedTask = await api.updateTask(id, updates);

      // Update with real data from server
      setTasks(prev =>
        prev.map(t => t.id === id ? updatedTask : t)
      );

      return updatedTask;
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return null;
    }
  }, [tasks]);

  /**
   * Delete a task with optimistic update
   * @param id - Task ID to delete
   * @returns True on success, false on error
   */
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    // Store previous state for rollback
    const previousTasks = tasks;

    // Optimistic delete
    setTasks(prev => prev.filter(t => t.id !== id));
    setError(null);

    try {
      // Make API call
      await api.deleteTask(id);
      return true;
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return false;
    }
  }, [tasks]);

  /**
   * Refetch tasks (alias for fetchTasks for clarity)
   */
  const refetch = useCallback(() => {
    return fetchTasks();
  }, [fetchTasks]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  };
}
