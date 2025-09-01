export interface TodoItem {
  id: number;
  description: string;
  completed: boolean;
}

export interface TodoList {
  id: number;
  name: string;
  items: TodoItem[];
}

export type NewItemTexts = {
  [listId: string]: string;
};
