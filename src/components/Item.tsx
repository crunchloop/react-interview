import { Trash2 } from "lucide-react";
import Button from "./atoms/Button";
import { deleteItem, toggleItem } from "../endpoints/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TodoItem } from "../types";

export function Item({ item }: { item: TodoItem }) {
  const { id, description, completed } = item;

  const queryClient = useQueryClient();

  const { mutate: deleteItemMutation } = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
    },
    onError: () => {
      toast.error("Error deleting item");
    },
  });

  const { mutate: toggleItemMutation } = useMutation({
    mutationFn: toggleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
    },
    onError: () => {
      toast.error("Error toggling item");
    },
  });

  return (
    <div className="flex group items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-2xs">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => toggleItemMutation(id)}
        className="bg-gray-100 border-gray-300 rounded cursor-pointer"
      />
      <span
        className={`flex-1 text-sm ${
          completed ? "text-gray-500" : "text-gray-900"
        }`}
      >
        {description}
      </span>
      <Button
        onClick={() => deleteItemMutation(id)}
        variant="danger"
        size="md"
        icon={Trash2}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
