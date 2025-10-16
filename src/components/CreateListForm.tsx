import { useState } from 'react'

interface CreateListFormProps {
  onCreateList: (name: string) => Promise<void>
}

export default function CreateListForm({ onCreateList }: CreateListFormProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setIsSubmitting(true)
      await onCreateList(name)
      setName('')
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
          placeholder="Enter list name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting || !name.trim()}>
        {isSubmitting ? 'Creating...' : 'Create List'}
      </button>
    </form>
  )
}
