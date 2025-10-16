import { useEffect, useState } from 'react'
import type { TodoItem } from '../types'
import { getTodoItems, createTodoItem, updateTodoItem, deleteTodoItem, completeAllTodoItems } from '../services/api'
import TodoItemComponent from './TodoItemComponent'
import CreateItemForm from './CreateItemForm'
import { useSignalR } from '../hooks/useSignalR'
import { JobState } from '../types'

interface TodoItemsPanelProps {
  todoListId: number | null
  todoListName: string | null
  onItemsChange: () => Promise<void>
}

export default function TodoItemsPanel({ todoListId, todoListName, onItemsChange }: TodoItemsPanelProps) {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [completionMessage, setCompletionMessage] = useState<string | null>(null)

  const { jobStatus, error: signalRError } = useSignalR(currentJobId)

  useEffect(() => {
    if (todoListId) {
      loadItems()
      setCurrentJobId(null)
      setCompletionMessage(null)
    } else {
      setItems([])
    }
  }, [todoListId])

  // Monitor job status changes
  useEffect(() => {
    if (!jobStatus) return

    if (jobStatus.state === JobState.Completed) {
      setCompletionMessage('All items marked as done successfully!')
      // Refresh items and list counter
      loadItems()
      onItemsChange()
      // Clear job ID after a short delay to show completion state
      setTimeout(() => setCurrentJobId(null), 1000)
      // Clear completion message after 5 seconds
      setTimeout(() => setCompletionMessage(null), 5000)
    } else if (jobStatus.state === JobState.Failed) {
      setError(jobStatus.errorMessage || 'Job failed')
      setTimeout(() => setCurrentJobId(null), 1000)
    }
  }, [jobStatus])

  const loadItems = async () => {
    if (!todoListId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getTodoItems(todoListId)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async (description: string, completed: boolean) => {
    if (!todoListId) return

    try {
      setError(null)
      await createTodoItem(todoListId, { description, completed })
      // Reload items to reflect the new item
      await loadItems()
      // Refresh parent lists to update item count
      await onItemsChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
      throw err
    }
  }

  const handleToggleComplete = async (itemId: number, completed: boolean) => {
    if (!todoListId) return

    // Find the item to get its description
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    try {
      setError(null)
      await updateTodoItem(todoListId, itemId, { description: item.description, completed })
      // Reload items to reflect the update
      await loadItems()
      // Refresh parent lists to update incomplete item count
      await onItemsChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!todoListId) return

    try {
      setError(null)
      await deleteTodoItem(todoListId, itemId)
      // Reload items to reflect the deletion
      await loadItems()
      // Refresh parent lists to update item count
      await onItemsChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  const handleCompleteAll = async () => {
    if (!todoListId) return

    try {
      setError(null)
      setCompletionMessage(null)
      const result = await completeAllTodoItems(todoListId)
      setCurrentJobId(result.jobId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start complete all job')
    }
  }

  const isProcessingJob = currentJobId !== null &&
    (!jobStatus || (jobStatus.state !== JobState.Completed && jobStatus.state !== JobState.Failed))

  const hasIncompleteItems = items.some(item => !item.completed)

  if (!todoListId) {
    return (
      <div className="panel items-panel">
        <h2>Todo Items</h2>
        <div className="empty-state">
          <p>Select a list to view items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel items-panel">
      <h2>Todo Items {todoListName && `- ${todoListName}`}</h2>
      <CreateItemForm onCreateItem={handleCreateItem} />
      {error && <div className="error">{error}</div>}
      {signalRError && <div className="error">SignalR error: {signalRError}</div>}
      {completionMessage && <div className="success">{completionMessage}</div>}
      {loading ? (
        <div className="empty-state">
          <p>Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No items in this list yet</p>
        </div>
      ) : (
        <div style={{ opacity: isProcessingJob ? 0.5 : 1, pointerEvents: isProcessingJob ? 'none' : 'auto' }}>
          {items.map((item) => (
            <TodoItemComponent
              key={item.id}
              item={item}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <button
            className="btn btn-primary"
            onClick={handleCompleteAll}
            disabled={isProcessingJob || !hasIncompleteItems}
            style={{ marginBottom: '10px' }}
          >
            Mark all as done
          </button>

          {jobStatus && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              {jobStatus.state === JobState.Queued && <p>Job queued, waiting to start...</p>}
              {jobStatus.state === JobState.Processing && (
                <p>Processing: {jobStatus.processedCount}/{jobStatus.totalCount} items completed...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
