export interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

export interface TodoList {
  id: number;
  name: string;
  items: TodoItem[];
}
