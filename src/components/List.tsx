import { Plus } from "lucide-react";
import Button from "./atoms/Button";
import Input from "./atoms/Input";
import { Item } from "./Item";
import { ListHeader } from "./ListHeader";
import { TodoList, NewItemTexts } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "../endpoints/api";
import { useState } from "react";
import { toast } from "sonner";

export default function List({ lists = [] }: { lists: TodoList[] }) {
  const queryClient = useQueryClient();
  const [newItemTexts, setNewItemTexts] = useState<NewItemTexts>({});

  const { mutate: createItemMutation } = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
    },
    onError: () => {
      toast.error("Error creating item");
    },
  });

  // Add item to a list
  const addItem = (listId: number) => {
    const description = newItemTexts[listId];
    createItemMutation({ listId, description });
    setNewItemTexts({ ...newItemTexts, [listId]: "" });
  };

  return (
    <>
      {lists.map((list) => (
        <div
          key={list.id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm h-fit"
        >
          <ListHeader list={list} />

          <div className="px-6 pb-6 space-y-4">
            {list.items?.map((item) => (
              <Item key={item.id} item={item} />
            ))}

            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <Input
                placeholder="New task..."
                value={newItemTexts[list.id] || ""}
                onChange={(e) =>
                  setNewItemTexts({
                    ...newItemTexts,
                    [list.id]: e.target.value,
                  })
                }
                onKeyPress={(e) => e.key === "Enter" && addItem(list.id)}
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => addItem(list.id)}
                disabled={!newItemTexts[list.id]}
                variant="primary"
                size="md"
                icon={Plus}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
