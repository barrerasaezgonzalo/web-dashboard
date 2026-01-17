"use client";

import { Task } from "@/types/";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/hooks/authFetch";

export interface TaskContextType {
  tasks: Task[];
  tasksLoading: boolean;
  getTasks: (id: string) => Promise<void>;
  addTask: (title: string, date?: string) => Promise<Task>;
  toggleTaskInDev: (id: string) => void;
  removeTask: (id: string) => Promise<void>;
  editTask: (
    id: string,
    newTitle: string,
    newDate?: string | undefined | null,
  ) => void;
}

export const TasksContext = createContext<TaskContextType | undefined>(
  undefined,
);

interface TaskProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const { userId } = useAuth();

  const getTasks = useCallback(async () => {
    if (!userId) return;
    setTasksLoading(true);
    try {
      const response = await authFetch(`/api/task`);
      const data = await response.json();

      // Safety check: Ensure data is an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setTasks([]); // Fallback to empty array on error
    } finally {
      setTasksLoading(false);
    }
  }, [userId]);

  const addTask = async (title: string, date?: string) => {
    setTasksLoading(true);
    try {
      const response = await authFetch("/api/task", {
        method: "POST",
        body: JSON.stringify({ title, date: date || null }),
      });
      const data = await response.json();
      const newEntry = data[0];
      setTasks((prev) => [...prev, newEntry]);
      return newEntry;
    } finally {
      setTasksLoading(false);
    }
  };

  const editTask = async (
    id: string,
    newTitle: string,
    newDate?: string | null,
  ) => {
    setTasksLoading(true);
    try {
      const response = await authFetch("/api/task", {
        method: "PATCH",
        body: JSON.stringify({ id, title: newTitle, date: newDate || null }),
      });
      const updated = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } finally {
      setTasksLoading(false);
    }
  };

  const removeTask = async (id: string) => {
    setTasksLoading(true);
    try {
      await authFetch(`/api/task?id=${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setTasksLoading(false);
    }
  };

  const toggleTaskInDev = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus = !task.in_dev;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, in_dev: nextStatus } : t)),
    );

    try {
      await authFetch("/api/task", {
        method: "PATCH",
        body: JSON.stringify({ id, in_dev: nextStatus, userId }),
      });
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, in_dev: task.in_dev } : t)),
      );
    }
  };

  useEffect(() => {
    if (userId) getTasks();
  }, [userId, getTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        tasksLoading,
        addTask,
        editTask,
        removeTask,
        toggleTaskInDev,
        getTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
