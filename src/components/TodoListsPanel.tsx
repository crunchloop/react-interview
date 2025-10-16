import type { TodoList } from '../types'
import TodoListItem from './TodoListItem'
import CreateListForm from './CreateListForm'

interface TodoListsPanelProps {
  lists: TodoList[]
  selectedListId: number | null
  loading: boolean
  error: string | null
  onCreateList: (name: string) => Promise<void>
  onSelectList: (id: number) => void
  onDeleteList: (id: number) => Promise<void>
  onUpdateList: (id: number, name: string) => Promise<void>
}

export default function TodoListsPanel({
  lists,
  selectedListId,
  loading,
  error,
  onCreateList,
  onSelectList,
  onDeleteList,
  onUpdateList,
}: TodoListsPanelProps) {
  return (
    <div className="panel lists-panel">
      <h2>Lists</h2>
      <CreateListForm onCreateList={onCreateList} />
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      ) : lists.length === 0 ? (
        <div className="empty-state">
          <p>No todo lists yet</p>
        </div>
      ) : (
        <div>
          {lists.map((list) => (
            <TodoListItem
              key={list.id}
              list={list}
              isActive={selectedListId === list.id}
              onSelect={onSelectList}
              onDelete={onDeleteList}
              onUpdate={onUpdateList}
            />
          ))}
        </div>
      )}
    </div>
  )
}
