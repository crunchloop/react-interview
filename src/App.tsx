import React, { useEffect, useState, useRef } from 'react';
import { getTodoLists, createTodoList } from './services/api';
import TodoList from './components/TodoList';
import startConnection from './signalR';
import { HubConnection } from '@microsoft/signalr';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- Imports de React-Bootstrap ---
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
// ------------------------------------

import logo from './assets/logo.png'; 


// Interfaz 
interface ITodoList {
  id: number;
  name: string;
}

function App() {
  const [lists, setLists] = useState<ITodoList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionInitialized = useRef(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const data = await getTodoLists();
        setLists(data);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();

    let newConnection: HubConnection | null = null;

    if (!connectionInitialized.current) {
      connectionInitialized.current = true;
      startConnection()
        .then(conn => {
          setConnection(conn);
          newConnection = conn;
        })
        .catch(err => console.error('Error starting connection:', err));
    }

    return () => {
      if (newConnection) {
        newConnection.stop();
        console.log('🔌 SignalR conexion stoped');
      }
    };
  }, []);

  const handleAddList = async () => {
    if (newListName.trim()) {
      try {
        const newList = await createTodoList(newListName);
        setLists(prevLists => [...prevLists, newList]);
        setNewListName('');
      } catch (error) {
        console.error('Error adding list:', error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="display-4 mb-3 text-center">App de Tareas</h1> 

      <div className="text-center mb-4"> 
        <Image 
          src={logo} 
          alt="Logo de la aplicación" 
          fluid 
          style={{ maxWidth: '100px', height: 'auto' }} 
        />
      </div>
      {/* -------------------------------- */}

      <InputGroup className="mb-4" style={{ maxWidth: '600px', margin: 'auto' }}>
        <Form.Control
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Nombre de la nueva lista"
          onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
        />
        <Button variant="primary" onClick={handleAddList}>
          Crear Lista
        </Button>
      </InputGroup>

      <Stack gap={3}>
        {connection ? (
          lists.map(list => (
            <TodoList key={list.id} list={list} connection={connection} />
          ))
        ) : (
          <p className="text-center">Estableciendo conexión...</p>
        )}
      </Stack>
      
    </Container>
  );
}

export default App;