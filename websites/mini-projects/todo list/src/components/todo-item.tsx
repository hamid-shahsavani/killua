import { useKillua } from "killua-beta";
import { useState } from "react";
import ModalEditTodo from "@/containers/modal-edit-todo";
import type { TTodo } from "@/types/todo";
import { todosSlice } from "@/slices/todos";

interface IProps {
  todo: TTodo;
  index: number;
}

export default function TodoItem(props: IProps): JSX.Element {
  // remove todo from localstorage
  const localStorageTodos = useKillua(todosSlice);

  // show/hide modal edit todo
  const [isOpenModalEditTodo, setIsOpenModalEditTodo] =
    useState<boolean>(false);

  return (
    <>
      <ModalEditTodo
        isOpen={isOpenModalEditTodo}
        onClose={(): void => setIsOpenModalEditTodo(false)}
        todo={props.todo}
      />
      <div className="mb-4 overflow-hidden rounded-lg border border-gray-600 p-[1px] last:mb-0">
        <div className="rounded-lg bg-black">
          {/* head */}
          <div className="flex justify-between p-3.5">
            <p className="px-2">{props.index + 1}</p>
            <div className="flex gap-2">
              <button
                onClick={(): void => {
                  setIsOpenModalEditTodo(true);
                }}
              >
                <img src={'/icons/edit.svg'} alt="edit" />
              </button>
              <button
                onClick={(): void => {
                  localStorageTodos.reducers.remove(props.todo.id);
                }}
              >
                <img src={'/icons/trash.svg'} alt="trash" />
              </button>
            </div>
          </div>
          {/* body */}
          <div>
            {[
              {
                title: "title",
                text: props.todo.title,
              },
              {
                title: "description",
                text: props.todo.description,
              },
              {
                title: "status",
                text: props.todo.status,
              },
            ].map((item) => (
              <div
                key={item.text}
                className="relative border-t border-gray-600 p-3.5"
              >
                <span className="title absolute -top-2 left-2 bg-black px-2 text-gray-300">
                  {item.title}
                </span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
