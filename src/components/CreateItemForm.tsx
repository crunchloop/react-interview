import { useState } from 'react'

interface CreateItemFormProps {
  onCreateItem: (description: string, completed: boolean) => Promise<void>
}

export default function CreateItemForm({ onCreateItem }: CreateItemFormProps) {
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    try {
      setIsSubmitting(true)
      await onCreateItem(description.trim(), completed)
      setDescription('')
      setCompleted(false)
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter item description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Completed</span>
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !description.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}
