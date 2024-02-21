import { slice } from "killua-beta";
import { toast } from "react-toastify";
import type { TTodo } from "@/types/todo";

export const todosSlice = slice({
  key: "todos",
  defaultClient: [] as TTodo[],
  reducers: {
    add: (value, payload: TTodo) => {
      toast.success("Todo added successfully");
      return [...value, payload];
    },
    remove: (value, payload: number) => {
      toast.success("Todo deleted successfully");
      return value.filter((todo) => todo.id !== payload);
    },
    edit: (value, payload: TTodo) => {
      toast.success("Todo edited successfully");
      return value.map((todo) => (todo.id === payload.id ? payload : todo));
    },
  },
  selectors: {
    isEmpty: (value) => value.length === 0,
    itemsCount: (value) => value.length,
  },
});
