import { Plus } from "lucide-react";
import Button from "./atoms/Button";
import Input from "./atoms/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTodoList } from "../endpoints/api";
import { toast } from "sonner";

export function CreateListForm() {
  const queryClient = useQueryClient();
  const [newListName, setNewListName] = useState("");

  const {
    mutate: createListMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createTodoList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      setNewListName("");
      toast.success("List created successfully");
    },
    onError: () => {
      toast.error("Error creating list");
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg space-y-2 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Create New List</h3>
      <div className="flex gap-2">
        <Input
          placeholder="List name..."
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && createListMutation(newListName)
          }
          className="flex-1"
          disabled={isPending}
        />
        <Button
          onClick={() => createListMutation(newListName)}
          disabled={!newListName.trim() || isPending}
          size="lg"
          icon={Plus}
        >
          {isPending ? "Creating..." : "Create List"}
        </Button>
      </div>
      {isError && (
        <p className="text-red-600 text-sm mt-2">
          Error creating list. Please try again.
        </p>
      )}
    </div>
  );
}
