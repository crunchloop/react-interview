export interface TodoItem {
    id: number,
    content: string,
    done: boolean,
}

export interface TodoList {
    id: number,
    name: string,
    items: TodoItem[],
} 