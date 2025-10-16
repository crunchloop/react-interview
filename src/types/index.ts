export interface TodoList {
  id: number;
  name: string;
  incompleteItemCount: number;
}

export interface TodoItem {
  id: number;
  description: string;
  completed: boolean;
  todoListId?: number;
}

export interface CreateTodoListPayload {
  name: string;
}

export interface UpdateTodoListPayload {
  name: string;
}

export interface CreateTodoItemPayload {
  description: string;
  completed: boolean;
}

export interface UpdateTodoItemPayload {
  description: string;
  completed: boolean;
}

export enum JobState {
  Queued = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3,
}

export interface JobStatus {
  jobId: string;
  state: JobState;
  processedCount: number;
  totalCount: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CompleteAllResponse {
  jobId: string;
}
