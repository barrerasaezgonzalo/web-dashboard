import { TasksContext } from "@/context/TasksContext";
import { useContext, useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { Task } from "@/types/";

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    return { tasks: [], tasksLoading: false } as any;
  }

  const { openToast, closeToast } = useToast();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setEditingTaskId("");
  };

  const handleAdd = async () => {
    if (title.trim().length < 5) {
      openToast({ message: "Titulo debe tener al menos 5 Letras" });
      return;
    }
    try {
      await context.addTask(title, date);
      resetForm();
      openToast({ message: `Tarea "${title}" agregada correctamente` });
    } catch (error) {
      openToast({ message: "Error agregando task" });
    }
  };

  const handleSave = async () => {
    if (title.trim().length < 5) {
      openToast({ message: "Titulo debe tener al menos 5 Letras" });
      return;
    }
    try {
      await context.editTask(editingTaskId, title, date);
      resetForm();
      openToast({ message: `Tarea actualizada agregada correctamente` });
    } catch (error) {
      openToast({ message: "Error guardando task" });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDate(task.date || "");
    inputRef.current?.focus();
  };

  const handleDelete = (taskId: string) => {
    openToast({
      message: "¿Estas seguro que deseas eliminar esta tarea?",
      onConfirm: async () => {
        await context.removeTask(taskId);
        closeToast();
        setTimeout(() => {
          openToast({
            message: "Tarea eliminada correctamente",
          });
        }, 100);
      },
      onCancel: closeToast,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      editingTaskId ? handleSave() : handleAdd();
    }
  };

  return {
    ...context,
    title,
    setTitle,
    date,
    setDate,
    editingTaskId,
    inputRef,
    handleAdd,
    handleSave,
    handleEdit,
    handleDelete,
    handleKeyDown,
  };
};
