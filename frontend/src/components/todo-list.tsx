import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onUpdate: (todos: Todo[]) => void;
  isRunning: boolean;
  onClose: () => void;
}

export function TodoList({ todos, onUpdate, isRunning, onClose }: TodoListProps) {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const toggle = (id: string) => {
    onUpdate(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTodoTitle.trim(),
      completed: false,
    };
    onUpdate([...todos, newTodo]);
    setNewTodoTitle("");
  };

  const handleDeleteTodo = (id: string) => {
    onUpdate(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 font-bold">task_alt</span>
          <h2 className="font-bold text-gray-800 text-base">Checklist</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-all"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px] block">close</span>
        </button>
      </div>

      {/* Input to manually add todo */}
      <form onSubmit={handleAddTodo} className="p-4 border-b border-gray-50 flex gap-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <span className="material-symbols-outlined text-gray-300 text-[48px] mb-2 animate-bounce">
              checklist
            </span>
            <p className="text-sm font-medium text-gray-400">
              {isRunning ? "Agent is working..." : "No items yet. Ask the agent to add some tasks!"}
            </p>
          </div>
        )}
        
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-200"
          >
            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo.id)}
                className="w-4.5 h-4.5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500/20 accent-indigo-600 transition-all cursor-pointer"
              />
              <span
                className={`text-sm truncate select-none font-medium ${
                  todo.completed ? "line-through text-gray-400 font-normal" : "text-gray-700"
                }`}
              >
                {todo.title}
              </span>
            </label>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-all"
              title="Delete task"
            >
              <span className="material-symbols-outlined text-[18px] block">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
