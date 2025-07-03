import axios from 'axios';
import { TodoList, TodoItem } from '../types';

const BASE_URL = 'http://localhost:3000/api/todoLists';

export const fetchTodoLists = async (): Promise<TodoList[]> => {
    const response = await axios.get<TodoList[]>(BASE_URL);
    return response.data;
};

export const fetchTodoListDetails = async (id: number): Promise<TodoList> => {
    const response = await axios.get<TodoList>(`${BASE_URL}/${id}`);
    return response.data;
}

export const createTodoList = async (name: string): Promise<TodoList> => {
    const response = await axios.post<TodoList>(BASE_URL, { name });
    return response.data;
}

export const updateTodoList = async (id: number, name: string): Promise<TodoList> => {
    const response = await axios.put<TodoList>(`${BASE_URL}/${id}`, { name });
    return response.data;
}

export const deleteTodoList = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
}

export const createTodoItem = async (listId: number, content: string): Promise<TodoItem> => {
    const response = await axios.post(`${BASE_URL}/${listId}/items`, { content });
    return response.data;
}

export const updateTodoItem = async (listId: number, itemId: number, done: boolean, content: string): Promise<TodoItem> => {
    const response = await axios.put(`${BASE_URL}/${listId}/items/${itemId}`, { done, content });
    return response.data;
}

export const deleteTodoItem = async (listId: number, itemId: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${listId}/items/${itemId}`);
}

export const bulkUpdateTodoItems = async (listId: number): Promise<void> => {
    await axios.post(`${BASE_URL}/${listId}/items/bulk-update`, {
  updates: [], // o los datos que uses para el bulk update
  userId: 'frontend-user',
});
}