import React from "react";

import { TasksContext } from "@/context/TasksContext";
import { useContext, useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { Task, UseTasksReturn } from "@/types/";

export const useTasks = (): UseTasksReturn => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks debe usarse dentro de <TasksProvider>");
  }

  const { openToast, closeToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setEditingTaskId("");
    setShowModal(false);
  };

  const handleAdd = async () => {
    try {
      await context.addTask(title, date, description);
      resetForm();
      openToast({ message: `Tarea "${title}" agregada correctamente` });
      setShowModal(false);
    } catch (error) {
      openToast({ message: "Error agregando task" });
    }
  };

  const handleSave = async () => {
    try {
      await context.editTask(editingTaskId, title, date, description);
      resetForm();
      openToast({ message: `Tarea "${title}" actualizada correctamente` });
    } catch (error) {
      openToast({ message: "Error guardando task" });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDate(task.date || "");
    setDescription(task.description ?? "");
    setShowModal(true);
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

  const handleTaskToggle = async (id: string) => {
    await context.toggleTaskInDev(id);
  };

  const emptyFields = title.trim() === "" || title.trim().length < 5;
  const disableSubmit = emptyFields || context.tasksLoading;

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
    handleTaskToggle,
    handleOpenModal,
    resetForm,
    showModal,
    description,
    setDescription,
    disableSubmit,
  };
};
