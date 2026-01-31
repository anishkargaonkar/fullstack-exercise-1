/**
 * API Client for Task Management
 * Handles all HTTP requests to the backend API
 */

import type { Task, TaskCreate, TaskUpdate, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to the server');
    }

    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

/**
 * Get all tasks
 * @returns Promise<Task[]> - Array of all tasks
 */
export async function getTasks(): Promise<Task[]> {
  return fetchApi<Task[]>('/tasks');
}

/**
 * Get a single task by ID
 * @param id - Task ID
 * @returns Promise<Task> - The requested task
 */
export async function getTask(id: string): Promise<Task> {
  return fetchApi<Task>(`/tasks/${id}`);
}

/**
 * Create a new task
 * @param task - Task data to create
 * @returns Promise<Task> - The created task with generated ID
 */
export async function createTask(task: TaskCreate): Promise<Task> {
  return fetchApi<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

/**
 * Update an existing task
 * @param id - Task ID to update
 * @param updates - Partial task data to update
 * @returns Promise<Task> - The updated task
 */
export async function updateTask(id: string, updates: TaskUpdate): Promise<Task> {
  return fetchApi<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a task
 * @param id - Task ID to delete
 * @returns Promise<void>
 */
export async function deleteTask(id: string): Promise<void> {
  return fetchApi<void>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Helper function to safely call API methods with error handling
 * Returns an ApiResponse object instead of throwing
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'An unknown error occurred';

    return { error: errorMessage };
  }
}

/**
 * Helper to check if the backend API is reachable
 * @returns Promise<boolean>
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await fetchApi('/health');
    return true;
  } catch {
    return false;
  }
}
