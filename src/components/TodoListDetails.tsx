import {
  Box,
  Button,
  Checkbox,
  Container,
  //  FormControl, FormGroup, FormLabel,
  IconButton,
  LinearProgress,
  //  Input, InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchTodoListDetails,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  bulkUpdateTodoItems,
} from "../api/todoList";
import { useEffect, useState } from "react";
import { TodoList } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { io } from "socket.io-client";

export default function TodoListDetails() {
  const { listid } = useParams<{ listid: string }>();
  const [listDetails, setListDetails] = useState<TodoList | null>(null);
  const [newItemContent, setNewItemContent] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [shouldConnect, setShouldConnect] = useState(false);
  const navigate = useNavigate();

  const fetchListDetails = async () => {
    try {
      if (listid) {
        const details = await fetchTodoListDetails(parseInt(listid));
        setListDetails(details);
      } else {
        console.error("List ID is not defined");
      }
    } catch (error) {
      console.error("Error fetching list details:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemContent.trim()) return;

    await createTodoItem(parseInt(listid!), newItemContent);
    setNewItemContent("");
    await fetchListDetails();
  };

  const handleEditItem = (taskId: number, currentContent: string) => {
    setEditingItemId(taskId);
    setEditedContent(currentContent);
  };

  const handleSaveEditedItem = async (taskId: number) => {
    await updateTodoItem(parseInt(listid!), taskId, false, editedContent);
    await fetchListDetails();
    setEditingItemId(null);
  };

  const handleToggleDone = (taskId: number) => {
    if (!listDetails) return;
    const updatedItems = listDetails.items
      ? listDetails.items.map((item) =>
          item.id === taskId ? { ...item, done: !item.done } : item
        )
      : [];
    setListDetails({ ...listDetails, items: updatedItems });
  };

  const handleDeleteItem = async (taskId: number) => {
    await deleteTodoItem(parseInt(listid!), taskId);
    await fetchListDetails();
  };

  const handleBulkUpdate = async () => {
    setShouldConnect(true);
    await bulkUpdateTodoItems(parseInt(listid!));
  };
  useEffect(() => {
    fetchListDetails();
  }, [listid]);

  useEffect(() => {
    if (!shouldConnect) return;

    const socket = io("http://localhost:3000", {
      query: { userId: "frontend-user" },
      reconnection: false,
    });

    socket.on(
      "bulk-progress",
      ({ progress, total }: { progress: number; total: number }) => {
        setIsUpdating(true);
        setProgress(progress);
        setTotal(total);

        if (progress >= total) {
          fetchListDetails();
          setTimeout(() => {
            setIsUpdating(false);
            setProgress(0);
            setTotal(0);
            setShouldConnect(false); // desconecta para evitar reconexiones
          }, 1000);
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [shouldConnect]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" mb={2} spacing={1}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{listDetails?.name}</Typography>
      </Stack>

      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Nueva tarea"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddItem}>
          Agregar
        </Button>
      </Box>

      <Stack spacing={2}>
        {listDetails?.items?.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            border="1px solid #ddd"
            borderRadius={1}
            px={2}
            py={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={item.done}
                onChange={() => handleToggleDone(item.id)}
              />
              {editingItemId === item.id ? (
                <TextField
                  size="small"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onBlur={() => handleSaveEditedItem(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEditedItem(item.id);
                  }}
                  autoFocus
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{ textDecoration: item.done ? "line-through" : "none" }}
                  onClick={() => handleEditItem(item.id, item.content)}
                >
                  {item.content}
                </Typography>
              )}
            </Box>
            <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBulkUpdate}
          disabled={isUpdating}
        >
          Marcar todos como completados
        </Button>
        {isUpdating && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {`Progreso: ${progress}/${total}`}
            </Typography>
            <Box sx={{ width: 150 }}>
              <LinearProgress
                variant="determinate"
                value={total > 0 ? (progress / total) * 100 : 0}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
