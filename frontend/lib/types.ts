/**
 * TypeScript type definitions matching the backend API
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'launched';
export type TaskPriority = 'normal' | 'high';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assignees: string[];
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assignees?: string[];
}

export interface TaskUpdate {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assignees?: string[];
}

export interface TasksByStatus {
  pending: Task[];
  in_progress: Task[];
  completed: Task[];
  launched: Task[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface TasksResponse {
  tasks: Task[];
}
