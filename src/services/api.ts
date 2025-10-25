import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://localhost:44355/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface TodoList {
  id: number;
  name: string;
}

interface TodoItem {
  id: number;
  todoListId: number;
  name: string;
  complete: boolean;
}

export const getTodoLists = async (): Promise<TodoList[]> => {
  try {
    const response: AxiosResponse<TodoList[]> = await api.get('/todolists');
    return response.data;
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    throw error;
  }
};

export const getTodoItems = async (listId: number): Promise<TodoItem[]> => {
  try {
    const response: AxiosResponse<any> = await api.get(`/todoList/${listId}/todoItem`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn(`Unexpected response for list ${listId}:`, response.data);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching items for list ${listId}:`, error);
    throw error;
  }
};

export const createTodoList = async (name: string): Promise<TodoList> => {
  try {
    const response: AxiosResponse<TodoList> = await api.post('/todolists', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating todo list:', error);
    throw error;
  }
};

export const createTodoItem = async (listId: number, name: string): Promise<TodoItem> => {
  try {
    const response: AxiosResponse<TodoItem> = await api.post(`/todoList/${listId}/todoItem`, { name });
    return response.data;
  } catch (error) {
    console.error(`Error creating item for list ${listId}:`, error);
    throw error;
  }
};

export const updateTodoItem = async (listId: number, itemId: number, name: string, complete: boolean): Promise<TodoItem> => {
  try {
    const response: AxiosResponse<TodoItem> = await api.put(`/todoList/${listId}/todoItem/${itemId}`, { name, complete });
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${itemId} for list ${listId}:`, error);
    throw error;
  }
};

export const deleteTodoItem = async (listId: number, itemId: number): Promise<void> => {
  try {
    await api.delete(`/todoList/${listId}/todoItem/${itemId}`);
  } catch (error) {
    console.error(`Error deleting item ${itemId} for list ${listId}:`, error);
    throw error;
  }
};

export const completeAllItems = async (listId: number): Promise<void> => {
  try {
    await api.post(`/todolists/${listId}/complete`);
  } catch (error) {
    console.error(`Error completing all items for list ${listId}:`, error);
    throw error;
  }
};