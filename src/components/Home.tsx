import { useEffect, useState } from "react";
import { TodoList } from "../types";
import {
  fetchTodoLists,
  createTodoList,
  updateTodoList,
  deleteTodoList,
} from "../api/todoList";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    const created = await createTodoList(newListName);
    setLists((prev) => [...prev, created]);
    setNewListName("");
  };

  const handleUpdate = async (id: number) => {
    updateTodoList(id, editedName);
    setLists((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, name: editedName } : list
      )
    );

    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteTodoList(id);
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  const fetchLists = async () => {
    fetchTodoLists()
      .then((data) => setLists(data))
      .catch((error) => console.error("Error fetching todo lists:", error));
  };

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}
    >
      <Typography variant="h4" gutterBottom>
        Mis Listas de Tareas
      </Typography>

      <Box mb={4} display="flex" gap={2}>
        <TextField
          label="Nueva lista"
          value={newListName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewListName(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleCreate();
          }}
          fullWidth
        />
        <Button variant="contained" onClick={handleCreate}>
          Crear
        </Button>
      </Box>
      <Stack spacing={2}>
        {lists.map((list) => {
          const isEditing = editingId === list.id;
          return (
            <Card key={list.id}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={editedName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditedName(e.target.value)
                      }
                      onBlur={() => handleUpdate(list.id)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") handleUpdate(list.id);
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <Typography variant="h6">{list.name}</Typography>
                      <IconButton
                        size="small"
                        onClick={(): void => {
                          setEditingId(list.id);
                          setEditedName(list.name);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/todolist/${list.id}`)}
                  >
                    Ver Tareas
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(list.id)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
