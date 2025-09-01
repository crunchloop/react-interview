import { ListTodo } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import List from "./List";
import EmptyState from "./states/EmptyState";
import { CreateListForm } from "./CreateListForm";
import { fetchTodoLists } from "../endpoints/api";
import { TodoList } from "../types";
import LoadingState from "./states/LoadingState";

export default function TaskManager() {
  const { data: lists = [], isLoading } = useQuery<TodoList[]>({
    queryKey: ["todoLists"],
    queryFn: fetchTodoLists,
  });

  // Loading state
  if (isLoading) {
    return <LoadingState text={"Loading your task lists..."} />;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ListTodo className="h-8 w-8" />
            My Todo Lists
          </h1>
          <p className="text-gray-600">Organize your tasks in custom lists</p>
        </div>

        <CreateListForm />

        {lists.length === 0 ? (
          <EmptyState
            icon={<ListTodo className="min-h-12 min-w-12" />}
            title="You don't have any lists yet"
            description="Create your first list to get started"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <List lists={lists} />
          </div>
        )}
      </div>
    </>
  );
}
