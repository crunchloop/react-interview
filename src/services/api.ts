import type {
  TodoList,
  TodoItem,
  CreateTodoListPayload,
  UpdateTodoListPayload,
  CreateTodoItemPayload,
  UpdateTodoItemPayload,
  CompleteAllResponse,
  JobStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Todo Lists
export async function getTodoLists(): Promise<TodoList[]> {
  const response = await fetch(`${API_BASE_URL}/todolists`);
  if (!response.ok) throw new Error('Failed to fetch todo lists');
  return response.json();
}

export async function createTodoList(payload: CreateTodoListPayload): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE_URL}/todolists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create todo list');
  return response.json();
}

export async function updateTodoList(id: number, payload: UpdateTodoListPayload): Promise<TodoList> {
  const response = await fetch(`${API_BASE_URL}/todolists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update todo list');
  return response.json();
}

export async function deleteTodoList(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todolists/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo list');
}

// Todo Items
export async function getTodoItems(todoListId: number): Promise<TodoItem[]> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/todos`);
  if (!response.ok) throw new Error('Failed to fetch todo items');
  return response.json();
}

export async function createTodoItem(
  todoListId: number,
  payload: CreateTodoItemPayload
): Promise<{ id: number; description: string }> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create todo item');
  return response.json();
}

export async function updateTodoItem(
  todoListId: number,
  id: number,
  payload: UpdateTodoItemPayload
): Promise<{ description: string; completed: boolean }> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update todo item');
  return response.json();
}

export async function deleteTodoItem(todoListId: number, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo item');
}

// Complete All
export async function completeAllTodoItems(todoListId: number): Promise<CompleteAllResponse> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/complete-all`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to start complete all job');
  return response.json();
}

export async function getJobStatus(todoListId: number, jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_BASE_URL}/todolists/${todoListId}/jobs/${jobId}/status`);
  if (!response.ok) throw new Error('Failed to fetch job status');
  return response.json();
}
