import type { TodoItem } from '../types'

interface TodoItemProps {
  item: TodoItem
  onToggleComplete: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

export default function TodoItemComponent({ item, onToggleComplete, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onToggleComplete(item.id, !item.completed)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.description}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <div className={`todo-item ${item.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={item.completed}
        onChange={handleToggle}
      />
      <span className="todo-text">{item.description}</span>
      <button
        className="btn btn-danger btn-small"
        onClick={handleDelete}
        style={{ marginLeft: 'auto' }}
      >
        Delete
      </button>
    </div>
  )
}
