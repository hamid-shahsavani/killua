import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ModalAddTodo from './containers/modal-add-todo';
import { useKillua } from 'killua-beta';
import { todosSlice } from './slices/todos';
import TodoItem from './components/todo-item';

function App() {
  // show/hide modal add todo
  const [isOpenModalAddTodo, setIsOpenModalAddTodo] = useState<boolean>(false);

  // get todos from localStorage / check todo list is empty
  const localStorageTodos = useKillua(todosSlice);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeButton={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      />
      <ModalAddTodo
        isOpen={isOpenModalAddTodo}
        onClose={(): void => setIsOpenModalAddTodo(false)}
      />
      <section className="flex h-screen w-screen flex-col items-center justify-center bg-black p-5 font-inter text-[15px] text-white">
        <div className="w-full max-w-[500px] space-y-4 border-gradient">
          <div className="bg-black px-3.5 py-4 rounded-lg">
            {/* head */}
            <div className="flex items-center justify-between font-medium">
              <p>
                Todo List ({localStorageTodos.selectors.itemsCount()} items)
              </p>
              <button
                onClick={(): void => setIsOpenModalAddTodo(true)}
                className="btn-animation rounded-md bg-purple-700 px-7 py-2 text-white transition-all duration-300"
              >
                Add
              </button>
            </div>
            {/* body */}
            <section className="minimal-scrollbar md:max-h-[437px] bg-black mt-4">
              {/* is todo in localStorage ? render with map : show todo list is mepty */}
              {!localStorageTodos.selectors.isEmpty() ? (
                <>
                  {localStorageTodos.get().map((item, index) => (
                    <TodoItem key={item.id} todo={item} index={index} />
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <img
                    src={'/images/todolist-is-empty.png'}
                    alt="todo list is empty"
                    width="150"
                  />
                  <p className="font-medium">todo list is empty!</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
