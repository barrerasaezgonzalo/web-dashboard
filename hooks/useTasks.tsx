import { TasksContext } from "@/context/TasksContext";
import { useContext, useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { Task } from "@/types";

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks debe ser usado dentro de un TasksProvider");
  }

  const { toast, openToast, closeToast, showToast } = useToast();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, setIsLoading] = useState(false);

  const handleAdd = async (title: string, date: string) => {
    if (!title.trim() || !date.trim()) {
      showToast(`Recuerda ingresar todos los campos`);
      return;
    }
    try {
      setIsLoading(true);
      const task = await context.addTask(title, date);
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

  const handleSave = async (id: string, title: string, date: string) => {
    try {
      setIsLoading(true);
      await context.editTask(id, title, date);
      setEditingTaskId("");
      setTitle("");
      setDate("");
      showToast("La tarea fue guardada correctamente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    if (!task) return;
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDate(task.date);
  };

  const handleTaskToggle = (taskId: string) => context.toggleTaskInDev(taskId);

  const handleRemove = (taskId: string) => context.removeTask(taskId);

  const handleDelete = (taskId: string) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar la tarea?",
      onConfirm: () => handleRemove(taskId),
      onCancel: closeToast,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editingTaskId) handleSave(editingTaskId, title, date);
      else handleAdd(title, date);
    }
  };

  return {
    ...context,
    toast,
    openToast,
    closeToast,
    showToast,
    title,
    setTitle,
    date,
    setDate,
    editingTaskId,
    setEditingTaskId,
    inputRef,
    setIsLoading,
    handleEdit,
    handleDelete,
    handleSave,
    handleAdd,
    handleTaskToggle,
    handleRemove,
    handleKeyDown,
  };
};
