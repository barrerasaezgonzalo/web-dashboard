import React from "react";

/* =========================
   Modelo base
========================= */

export interface Task {
  id: string;
  title: string;
  date?: string | null;
  in_dev: boolean;
  order?: number;
  description?: string;
}

/* =========================
   Component Props
========================= */

export interface TaskItemProps {
  task: Task;
  handleEdit: (task: Task) => void;
  handleRemove: (taskId: string) => void;
  handleTaskToggle: (taskId: string) => void;
}

export interface TaskInputProps {
  title: string;
  setTitle: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  editingTaskId: string | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAdd: () => Promise<void>;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

export interface TaskActionButtonProps {
  icon: React.ReactNode;
  tooltipType?: "default" | "success" | "danger";
  tooltipText: string;
  onClick?: () => void;
  inDev?: boolean;
}

/* =========================
   Context
========================= */

export interface TaskContextType {
  tasks: Task[];
  tasksLoading: boolean;
  getTasks: () => Promise<void>;
  addTask: (
    title: string,
    date?: string,
    description?: string,
  ) => Promise<Task>;
  editTask: (
    id: string,
    newTitle: string,
    newDate?: string | null,
    newDescription?: string | null,
  ) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTaskInDev: (id: string) => Promise<void>;
}

export interface TaskModalProps {
  onClose: () => void;
  title: string;
  setTitle: (s: string) => void;
  date: string;
  setDate: (d: string) => void;
  onSave: () => void;
  editingTaskId?: string | null;
  isLoading: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  description: string;
  setDescription: (d: string) => void;
}

export interface UseTasksReturn {
  tasks: Task[];
  tasksLoading: boolean;
  title: string;
  setTitle: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  editingTaskId: string | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleAdd: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleEdit: (task: Task) => void;
  handleDelete: (id: string) => void;
  handleTaskToggle: (id: string) => Promise<void>;
  handleOpenModal: () => void;
  resetForm: () => void;
  showModal: boolean;
  description: string;
  setDescription: (d: string) => void;
}
