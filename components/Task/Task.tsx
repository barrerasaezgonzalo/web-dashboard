"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Toast } from "../ui/Toast";
import { useTasks } from "@/hooks/useTasks";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { reorderTasks } from "@/utils";
import { Task } from "@/types";
import { useToast } from "@/hooks/useToast";
import { TaskItem } from "./TaskItem";
import { TaskInput } from "./TaskInput";
import { ListChecks } from "lucide-react";

const Tasks: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    tasks,
    addTask,
    removeTask,
    updateTasksOrder,
    toggleTaskInDev,
    editTask,
  } = useTasks();
  const { toast, openToast, closeToast } = useToast();

  const showToast = (message: string) => {
    openToast({
      message,
      onConfirm: closeToast,
    });
  };

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      const task = await addTask(title, date);
      setTitle("");
      setDate("");
      showToast(`Tarea "${task.title}" agregada correctamente`);
    } catch (error: unknown) {
      console.error(error);
      showToast("La tarea no se pudo agregar. Intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    if (!task) return;
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDate(task.date!);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await editTask(editingTaskId, title, date);
      setEditingTaskId("");
      setTitle("");
      setDate("");
      showToast("La tarea fue guardada correctamente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (taskId: string) => removeTask(taskId);
  const handleTaskToggle = (taskId: string) => toggleTaskInDev(taskId);

  const handleDelete = (taskId: string) => {
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

      <h2
        id="tasks-heading"
        className="flex gap-2 text-xl font-bold mb-4 border-b"
      >
        <ListChecks size={25} />
        Lista de pendientes
      </h2>

      <TaskInput
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        inputRef={inputRef}
        handleKeyDown={handleKeyDown}
        editingTaskId={editingTaskId}
        handleAdd={handleAdd}
        handleSave={handleSave}
        isLoading={isLoading}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
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
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <TaskItem
                      task={task}
                      provided={provided}
                      snapshot={snapshot}
                      handleEdit={handleEdit}
                      handleRemove={handleDelete}
                      handleTaskToggle={handleTaskToggle}
                    />
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

export default Tasks;
