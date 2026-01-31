/**
 * TypeScript type definitions for the task management application
 */

/**
 * Task status enumeration
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'REVIEW';

/**
 * Task priority levels
 */
export type TaskPriority = 'HIGH' | 'NORMAL';

/**
 * Complete Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a new task
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export interface TaskCreate {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

/**
 * Input type for updating an existing task
 * All fields are optional except the ones you want to update
 */
export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * Tasks organized by their status
 * Used for Kanban board display
 */
export interface TasksByStatus {
  TODO: Task[];
  IN_PROGRESS: Task[];
  REVIEW: Task[];
  DONE: Task[];
}

/**
 * API response wrapper for error handling
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Status display configuration
 */
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Priority display configuration
 */
export interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Helper type for status configurations mapping
 */
export type StatusConfigMap = {
  [K in TaskStatus]: StatusConfig;
};

/**
 * Helper type for priority configurations mapping
 */
export type PriorityConfigMap = {
  [K in TaskPriority]: PriorityConfig;
};
