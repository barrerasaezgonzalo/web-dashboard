"use client";

import { Save, SquarePen, Trash } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";
import { Toast } from "./Toast";
import { Task, TaskProps } from "@/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Skeleton } from "./Skeleton";
import { useData } from "@/hooks/useData";

const Todo: React.FC<TaskProps> = ({
  tasks,
  addTask,
  removeTask,
  editTask,
  toggleTaskCompletion,
  tasksLoading,
}) => {
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [removingTaskId, setRemovingTaskId] = useState("");
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const { updateTasksOrder } = useData();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editingTaskId &&
        editInputRef.current &&
        !editInputRef.current.contains(event.target as Node)
      ) {
        if (newTitle.trim()) {
          editTask(editingTaskId, newTitle);
        }
        setEditingTaskId("");
        setNewTitle("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTaskId, newTitle]);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title);
    setTitle("");
  };

  const handleAddTitle = (e: { key: string }) => {
    if (e.key === "Enter" && title.trim()) {
      handleAdd();
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    // Guardamos el nuevo orden vía context/API
    updateTasksOrder(items);
  };

  if (tasksLoading) {
    return <Skeleton rows={5} height={40} />;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow">
      {showToast && (
        <Toast
          message="¿Estás seguro que deseas eliminar la tarea?"
          onConfirm={() => {
            removeTask(removingTaskId);
            setShowToast(false);
          }}
          onCancel={() => setShowToast(false)}
        />
      )}

      <h2 className="text-xl font-bold mb-4 border-b">Lista de pendientes</h2>

      <div className="flex gap-2 mt-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleAddTitle}
          type="text"
          placeholder="Agregar nueva tarea"
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="mt-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks?.map((todo: Task, index) => (
                <Draggable
                  key={todo.id || index}
                  draggableId={String(todo.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border-b-2 border-gray-200 py-2 pr-4 last:border-b-0 rounded flex items-center justify-between ${
                        todo.completed ? "bg-blue-100" : "bg-red-300"
                      } ${snapshot.isDragging ? "bg-blue-200" : ""}`}
                    >
                      <div className="flex items-center gap-2 px-2 shrink w-full">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() =>
                            todo.id && toggleTaskCompletion(todo.id)
                          }
                        />

                        {todo.id !== editingTaskId ? (
                          <h3 className="font-normal text-md pl-2 max-w-[250px]">
                            {todo.title}
                          </h3>
                        ) : (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newTitle.trim()) {
                                editTask(todo.id ?? "", newTitle);
                                setEditingTaskId("");
                                setNewTitle("");
                              }
                            }}
                            className="
                              mt-2 
                              w-full 
                              text-black  
                              p-2 border 
                              border-gray-300 
                              rounded 
                              focus:outline-none 
                              focus:ring-1 
                              focus:ring-blue-400"
                            autoFocus
                          />
                        )}
                      </div>

                      <div className="flex gap-2">
                        {todo.id !== editingTaskId ? (
                          <button
                            className="text-black hover:text-gray-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTaskId(todo.id ?? "");
                              setNewTitle(todo.title);
                            }}
                          >
                            <SquarePen size={25} />
                          </button>
                        ) : (
                          <button
                            className="text-black hover:text-gray-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              editTask(todo.id ?? "", newTitle);
                              setEditingTaskId("");
                              setNewTitle("");
                            }}
                            disabled={!newTitle.trim()}
                          >
                            <Save size={25} />
                          </button>
                        )}

                        <button
                          className="text-black hover:text-gray-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemovingTaskId(todo.id ?? "");
                            setShowToast(true);
                          }}
                        >
                          <Trash size={25} />
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default memo(Todo);
