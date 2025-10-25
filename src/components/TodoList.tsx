import React, { useEffect, useState } from 'react';
import { getTodoItems, createTodoItem, updateTodoItem, deleteTodoItem, completeAllItems } from '../services/api';
import { HubConnection } from '@microsoft/signalr';

// --- Imports de React-Bootstrap ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
// ------------------------------------

import TodoItem, { ITodoItem } from './TodoItem'; 

// --- INTERFACES  ---
interface ITodoList {
  id: number;
  name: string;
}

interface NotificationItem {
  listId: number;
  itemId: number;
}
// ------------------------------------------

interface TodoListProps {
  list: ITodoList;
  connection: HubConnection;
}

const TodoList: React.FC<TodoListProps> = ({ list, connection }) => {
  const [items, setItems] = useState<ITodoItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [editItem, setEditItem] = useState<ITodoItem | null>(null);

  // --- EFECTOS ---

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getTodoItems(list.id);
        setItems(data);
      } catch (error) {
        console.error(`Error fetching items for list ${list.id}:`, error);
      }
    };
    fetchItems();
  }, [list.id]);

  useEffect(() => {
    if (connection) {
      const itemCompletedHandler = (notification: NotificationItem) => {
        console.log('Received ItemCompleted event:', notification);
        const { itemId } = notification;
        if (itemId && list.id === notification.listId) {
          setItems(prevItems => prevItems.map(item =>
            item.id === itemId ? { ...item, complete: true } : item
          ));
        }
      };
      connection.on('ItemCompleted', itemCompletedHandler);
      return () => {
        connection.off('ItemCompleted', itemCompletedHandler);
      };
    }
  }, [connection, list.id]);


  // --- HANDLERS ---

  const handleCreateItem = async () => {
    if (newItemName.trim()) {
      try {
        const newItem = await createTodoItem(list.id, newItemName);
        setItems(prevItems => [...prevItems, newItem]);
        setNewItemName('');
      } catch (error) {
        console.error(`Error creating item for list ${list.id}:`, error);
      }
    }
  };

  const handleUpdateItem = async (id: number, name: string, complete: boolean) => {
    try {
      await updateTodoItem(list.id, id, name, complete);
      setItems(prevItems => prevItems.map(item =>
        item.id === id ? { ...item, name, complete } : item
      ));
      setEditItem(null); 
    } catch (error) {
      console.error(`Error updating item ${id} for list ${list.id}:`, error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteTodoItem(list.id, id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error deleting item ${id} for list ${list.id}:`, error);
    }
  };
  
  const handleCompleteAll = async () => {
     try {
      await completeAllItems(list.id);
    } catch (error) {
      console.error(`Error completing all items for list ${list.id}:`, error);
    }
  };

  const handleToggleComplete = async (itemToToggle: ITodoItem) => {
    const originalItems = [...items];

    setItems(prevItems => prevItems.map(item =>
      item.id === itemToToggle.id ? { ...item, complete: !item.complete } : item
    ));

    try {
      await updateTodoItem(list.id, itemToToggle.id, itemToToggle.name, !itemToToggle.complete);
    } catch (error) {
      console.error(`Error toggling item ${itemToToggle.id}:`, error);
      setItems(originalItems);
    }
  };

  // --- RENDER ---

  return (
    <Container style={{ marginBottom: '20px' }}>
      <Card>
        <Card.Header as="h2">{list.name}</Card.Header>
        <Card.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Nueva tarea"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
            />
            <Button variant="primary" onClick={handleCreateItem}>
              Crear
            </Button>
          </InputGroup>
          
          <ListGroup>
            {Array.isArray(items) && items.length > 0 ? (
              
              items.map(item => (
                <TodoItem
                  key={item.id}
                  item={item}
                  editItem={editItem}
                  setEditItem={setEditItem}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onToggleComplete={handleToggleComplete}
                />
              ))

            ) : (
              <ListGroup.Item>No hay ítems.</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
        
        <Card.Footer>
           <Button variant="info" size="sm" onClick={handleCompleteAll}>
            Autocompletar todo
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TodoList;