import { useState } from 'react'
import type { TodoList } from '../types'
import * as React from 'react';

interface TodoListItemProps {
  list: TodoList
  isActive: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string) => void
}

export default function TodoListItem({ list, isActive, onSelect, onDelete, onUpdate }: TodoListItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(list.name)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${list.name}"?`)) {
      onDelete(list.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditName(list.name)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editName.trim() && editName !== list.name) {
      onUpdate(list.id, editName.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(false)
    setEditName(list.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (editName.trim() && editName !== list.name) {
        onUpdate(list.id, editName.trim())
      }
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditName(list.name)
    }
  }

  return (
    <div
      className={`list-item ${isActive ? 'active' : ''}`}
      onClick={() => !isEditing && onSelect(list.id)}
    >
      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          style={{ flex: 1, marginRight: '10px' }}
        />
      ) : (
        <span>{list.name}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isEditing && <span className="item-count">({list.incompleteItemCount})</span>}
        {isEditing ? (
          <>
            <button
              className="btn btn-primary btn-small"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-small"
              onClick={handleCancel}
              style={{ background: '#6c757d', color: 'white' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-small"
              onClick={handleEdit}
              style={{ background: '#28a745', color: 'white' }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-small"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
