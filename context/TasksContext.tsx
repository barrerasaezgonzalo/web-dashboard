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
  editTask: (id: string, newTitle: string, newDate: string) => void;
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
    if (userId === null) {
      console.warn("getTasks llamado sin userId");
      return;
    }
    setTasksLoading(true);
    try {
      const response = await authFetch(`/api/task`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [userId]);

  const addTask = async (title: string, date?: string): Promise<Task> => {
    try {
      setTasksLoading(true);
      const response = await authFetch("/api/task", {
        method: "POST",
        body: JSON.stringify({ title, date }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al agregar tarea");
      }
      const data = await response.json();
      const task: Task = data[0];
      setTasks((prev) => [...prev, task]);
      getTasks();
      return task;
    } catch (error) {
      console.log("Error al agregar tarea:", error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  const editTask = async (id: string, newTitle: string, newDate: string) => {
    try {
      setTasksLoading(true);
      const response = await authFetch("/api/task", {
        method: "PATCH",
        body: JSON.stringify({
          id,
          title: newTitle,
          date: newDate,
        }),
      });
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      getTasks();
    } catch (error) {
      console.error("Error al editar tarea:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      getTasks();
    }
  }, [userId, getTasks]);

  const toggleTaskInDev = async (id: string) => {
    const taskBefore = tasks.find((t) => t.id === id);
    if (!taskBefore) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, in_dev: !task.in_dev } : task,
      ),
    );

    try {
      setTasksLoading(true);
      const res = await authFetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, in_dev: !taskBefore.in_dev, userId }),
      });

      if (!res.ok) throw new Error("Error actualizando task");
    } catch (error) {
      console.log("Error en toggleTaskInDev:", error);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, in_dev: taskBefore.in_dev } : task,
        ),
      );
    } finally {
      setTasksLoading(false);
    }
  };

  const removeTask = async (id: string) => {
    try {
      setTasksLoading(true);
      const res = await authFetch(`/api/task?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.log("Error Interno:", error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        removeTask,
        toggleTaskInDev,
        tasksLoading,
        getTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
