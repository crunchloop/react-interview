import { useEffect, useState } from 'react'
import './App.css'
import type { TodoList } from './types'
import { getTodoLists, createTodoList, deleteTodoList, updateTodoList } from './services/api'
import TodoListsPanel from './components/TodoListsPanel'
import TodoItemsPanel from './components/TodoItemsPanel'

function App() {
  const [lists, setLists] = useState<TodoList[]>([])
  const [selectedListId, setSelectedListId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTodoLists()
      setLists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lists')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectList = (id: number) => {
    setSelectedListId(id)
  }

  const handleCreateList = async (name: string) => {
    try {
      setError(null)
      const result = await createTodoList({ name })
      // Reload lists to get the newly created list with all its data
      await loadLists()
      // Auto-select the newly created list
      setSelectedListId(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list')
      throw err
    }
  }

  const handleDeleteList = async (id: number) => {
    try {
      setError(null)
      await deleteTodoList(id)
      // If we deleted the selected list, clear the selection
      if (selectedListId === id) {
        setSelectedListId(null)
      }
      // Reload lists to reflect the deletion
      await loadLists()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list')
    }
  }

  const handleUpdateList = async (id: number, name: string) => {
    try {
      setError(null)
      await updateTodoList(id, { name })
      // Reload lists to reflect the update
      await loadLists()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list')
    }
  }

  const selectedList = lists.find((list) => list.id === selectedListId)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Crunchloop Todo Lists Manager</h1>
      </header>
      <div className="container">
        <TodoListsPanel
          lists={lists}
          selectedListId={selectedListId}
          loading={loading}
          error={error}
          onCreateList={handleCreateList}
          onSelectList={handleSelectList}
          onDeleteList={handleDeleteList}
          onUpdateList={handleUpdateList}
        />
        <TodoItemsPanel
          todoListId={selectedListId}
          todoListName={selectedList?.name || null}
          onItemsChange={loadLists}
        />
      </div>
    </div>
  )
}

export default App