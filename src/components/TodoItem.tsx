import React from 'react';

// --- Imports de React-Bootstrap ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
// ------------------------------------
import { PencilFill, Trash3Fill } from 'react-bootstrap-icons';

export interface ITodoItem {
  id: number;
  todoListId: number;
  name: string;
  complete: boolean;
}

interface TodoItemProps {
  item: ITodoItem;
  editItem: ITodoItem | null; 
  setEditItem: (item: ITodoItem | null) => void;
  onUpdate: (id: number, name: string, complete: boolean) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (item: ITodoItem) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, editItem, setEditItem, onUpdate, onDelete, onToggleComplete }) => {

  const isEditing = editItem && editItem.id === item.id;

return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      variant={item.complete ? 'light' : ''}
    >
      {isEditing ? (
        <Stack direction="horizontal" gap={2} className="w-100">
          <Form.Control
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          />
          <Form.Check
            type="checkbox"
            checked={editItem.complete}
            onChange={(e) => setEditItem({ ...editItem, complete: e.target.checked })}
          />
          <Button
            variant="success"
            size="sm"
            onClick={() => onUpdate(item.id, editItem.name, editItem.complete)}
          >
            Guardar
          </Button>
        </Stack>

      ) : (

        // --- Render ---
        <>
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id={`check-${item.id}`} // ID único para el label
              checked={item.complete}
              onChange={() => onToggleComplete(item)} // <-- Llama a la nueva función
              className="me-2" // Margen a la derecha
            />
            <label 
              htmlFor={`check-${item.id}`}
              style={{ 
                textDecoration: item.complete ? 'line-through' : 'none',
                cursor: 'pointer' // Cambia el cursor al pasar por el texto
              }}
            >
              {item.name}
            </label>
          </div>

          <Stack direction="horizontal" gap={2}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setEditItem(item)}
            >
              <PencilFill />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              <Trash3Fill /> 
            </Button>
          </Stack>
        </>
      )}
    </ListGroup.Item>
  );
};

export default TodoItem;