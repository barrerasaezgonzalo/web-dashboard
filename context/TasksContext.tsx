"use client";

import { Task, TaskContextType } from "@/types/";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/hooks/authFetch";
import { trackError } from "@/utils/logger";

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
      if (!response.ok) throw new Error("getTasks: api Error");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      trackError(error, "getTasks");
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [userId]);

  const addTask = async (
    title: string,
    date?: string,
    description?: string,
  ) => {
    setTasksLoading(true);
    try {
      const response = await authFetch("/api/task", {
        method: "POST",
        body: JSON.stringify({
          title,
          date: date || null,
          description: description || null,
        }),
      });
      if (!response.ok) throw new Error("addTask: api Error");
      const data = await response.json();
      const newEntry = data[0];
      setTasks((prev) => [...prev, newEntry]);
      return newEntry;
    } catch (error) {
      trackError(error, "addTask");
    } finally {
      setTasksLoading(false);
    }
  };

  const editTask = async (
    id: string,
    newTitle: string,
    newDate?: string | null,
    newDescription?: string | null,
  ) => {
    setTasksLoading(true);
    try {
      const response = await authFetch("/api/task", {
        method: "PATCH",
        body: JSON.stringify({
          id,
          title: newTitle,
          date: newDate || null,
          description: newDescription || null,
        }),
      });
      if (!response.ok) throw new Error("editTask: api Error");

      const updated = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      getTasks();
    } catch (error) {
      trackError(error, "editTask");
    } finally {
      setTasksLoading(false);
    }
  };

  const removeTask = async (id: string) => {
    setTasksLoading(true);
    try {
      const response = await authFetch(`/api/task?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("removeTask: api Error");

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      trackError(error, "removeTask");
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
      const response = await authFetch("/api/task", {
        method: "PATCH",
        body: JSON.stringify({ id, in_dev: nextStatus, userId }),
      });
      if (!response.ok) throw new Error("toggleTaskInDev: api Error");
    } catch (error) {
      trackError(error, "toggleTaskInDev");
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
