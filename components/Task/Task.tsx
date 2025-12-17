"use client";

import { useState, memo, useCallback, useRef, useEffect } from "react";
import { Toast } from "../ui/Toast";
import { useTasks } from "@/hooks/useTasks";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  CirclePlus,
  GripHorizontal,
  Rocket,
  Save,
  SquarePen,
  Trash,
} from "lucide-react";
import { formatDateToDMY, getDaysRemainingUntil, reorderTasks } from "@/utils";
import { Task } from "@/types";
import { useToast } from "@/hooks/useToast";
import { TaskInputComponent } from "./TaskInput";

const Tasks: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    tasks,
    addTask,
    removeTask,
    updateTasksOrder,
    toggleTaskInDev,
    editTask,
  } = useTasks();
  const { toast, openToast, closeToast } = useToast();

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title, date);
    setTitle("");
    setDate("");
    showSuccess("La tarea fue agregada correctamente");
  };

  const handleRemove = (taskId: string) => {
    if (!taskId) return;
    removeTask(taskId);
  };

  const handleTaskToggle = (taskId: string) => {
    if (!taskId) return;
    toggleTaskInDev(taskId);
  };

  const handleEdit = (task: Task) => {
    if (!task) return;
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDate(task.date!);
  };

  const handleSave = () => {
    editTask(editingTaskId, title, date);
    setEditingTaskId("");
    setTitle("");
    setDate("");
    showSuccess("La tarea fue guardada correctamente");
  };

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const reordered = reorderTasks(
        tasks,
        result.source.index,
        result.destination.index,
      );

      updateTasksOrder(reordered);
    },
    [tasks, updateTasksOrder],
  );

  const showSuccess = (message: string) => {
    openToast({
      message,
      onConfirm: closeToast,
    });
  };

  const confirmDelete = (taskId: string) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar la tarea?",
      onConfirm: () => handleRemove(taskId),
      onCancel: closeToast,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim())
      editingTaskId ? handleSave() : handleAdd();
  };

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  return (
    <div
      className="bg-blue-100 p-4 rounded shadow"
      role="region"
      aria-labelledby="tasks-heading"
    >
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm();
            closeToast();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  closeToast();
                }
              : undefined
          }
        />
      )}

      <h2 id="tasks-heading" className="text-xl font-bold mb-4 border-b">
        Lista de pendientes
      </h2>

      <TaskInputComponent
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        inputRef={inputRef}
        handleKeyDown={handleKeyDown}
        editingTaskId={editingTaskId}
        handleAdd={handleAdd}
        handleSave={handleSave}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              role="list"
              aria-labelledby="task-heading"
              className="mt-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id || index}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot,
                  ) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-b-2 border-gray-200 py-2 pr-1 last:border-b-0 rounded flex items-center justify-between 
                                            ${task.in_dev ? "bg-blue-300" : "bg-red-300"} 
                                            ${snapshot.isDragging ? "bg-blue-200" : ""}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab pl-2 select-none"
                        aria-label="Arrastrar para reordenar"
                        role="button"
                      >
                        <div className="relative inline-block group">
                          <GripHorizontal
                            className="cursor-pointer"
                            size={25}
                          />
                          <div
                            className="
                                                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                                            hidden group-hover:block
                                                            whitespace-nowrap
                                                            rounded bg-gray-900 px-2 py-1
                                                            text-xs text-white        "
                          >
                            Arrastra para ordenar
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 px-2 shrink w-full">
                        <h3
                          className="font-normal text-md pl-2 max-w-[250px] select-text"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.title}
                        </h3>
                        {task.date && (
                          <small className="pl-2">
                            {formatDateToDMY(task.date)}, Quedan{" "}
                            {getDaysRemainingUntil(task.date)} Días
                          </small>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          aria-label={`Comenzar ${task.title}`}
                          onClick={() => task.id && handleTaskToggle(task.id)}
                        >
                          <div className="relative inline-block group">
                            <Rocket className="cursor-pointer" size={25} />
                            <div
                              className="
                                                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                                            hidden group-hover:block
                                                            whitespace-nowrap
                                                            rounded bg-gray-900 px-2 py-1
                                                            text-xs text-white        "
                            >
                              Comenzar Tarea
                            </div>
                          </div>
                        </button>
                        <button
                          aria-label={`Editar ${task.title}`}
                          onClick={() => task.id && handleEdit(task)}
                        >
                          <div className="relative inline-block group">
                            <SquarePen className="cursor-pointer" size={25} />
                            <div
                              className="
                                                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                                            hidden group-hover:block
                                                            whitespace-nowrap
                                                            rounded bg-gray-900 px-2 py-1
                                                            text-xs text-white        "
                            >
                              Editar Tarea
                            </div>
                          </div>
                        </button>
                        <button
                          aria-label={`Eliminar ${task.title}`}
                          onClick={() => confirmDelete(task.id)}
                        >
                          <div className="relative inline-block group">
                            <Trash className="cursor-pointer" size={25} />
                            <div
                              className="
                                                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                                            hidden group-hover:block
                                                            whitespace-nowrap
                                                            rounded bg-gray-900 px-2 py-1
                                                            text-xs text-white        "
                            >
                              Eliminar Tarea
                            </div>
                          </div>
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

export default memo(Tasks);
