import { Trash2 } from "lucide-react";
import Button from "./atoms/Button";
import { TodoList } from "../types";
import { completeAllItems, deleteTodoList } from "../endpoints/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ListHeader = ({ list }: { list: TodoList }) => {
  const queryClient = useQueryClient();

  const completedCount =
    list.items?.filter((item) => item.completed).length || 0;
  const totalCount = list.items?.length || 0;
  const allCompleted = list.items?.every((item) => item.completed);

  const { mutate: deleteListMutation } = useMutation({
    mutationFn: deleteTodoList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      toast.success("List deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting list");
    },
  });

  const { mutate: completeAllItemsMutation } = useMutation({
    mutationFn: completeAllItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
    },
    onError: () => {
      toast.error("Error completing all items");
    },
  });

  // Toggle all items in a list
  const toggleAllItems = (list: TodoList) => {
    const complete = !allCompleted; // If all are completed, uncomplete them; otherwise complete them
    completeAllItemsMutation({ listId: list.id, complete });
  };

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {list.name}
        </h3>

        <Button
          onClick={() => deleteListMutation(list.id)}
          variant="danger"
          size="md"
          icon={Trash2}
        />
      </div>

      <div className="text-sm text-gray-500">
        {completedCount} of {totalCount} completed
      </div>

      {totalCount > 0 && (
        <Button
          onClick={() => toggleAllItems(list)}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          {allCompleted ? "Uncomplete all" : "Complete all"}
        </Button>
      )}
    </div>
  );
};
