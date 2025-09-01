import { TodoList } from "../types";

export const fetchTodoLists = async (): Promise<TodoList[]> => {
  const response = await fetch("/api/todolists");
  return response.json();
};

export const createTodoList = async (name: string): Promise<TodoList> => {
  const response = await fetch("/api/todolists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
};

export const deleteTodoList = async (listId: number): Promise<void> => {
  await fetch(`/api/todolists/${listId}`, {
    method: "DELETE",
  });
};

export const deleteItem = async (itemId: number): Promise<void> => {
  await fetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });
};

export const createItem = async ({
  listId,
  description,
}: {
  listId: number;
  description: string;
}): Promise<void> => {
  await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todo_list_id: listId,
      description,
      completed: false,
    }),
  });
};

export const toggleItem = async (itemId: number): Promise<void> => {
  await fetch(`/api/items/${itemId}/toggle`, {
    method: "PATCH",
  });
};

export const completeAllItems = async ({
  listId,
  complete,
}: {
  listId: number;
  complete: boolean;
}): Promise<void> => {
  await fetch(`/api/todolists/${listId}/complete-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ complete }),
  });
};
