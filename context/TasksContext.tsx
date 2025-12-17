"use client";

import { Task } from "@/types";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "@/context/UserContext";

export interface TaskContextType {
  tasks: Task[];
  tasksLoading: boolean;
  getTasks: (id: string) => Promise<void>;
  addTask: (title: string, date?: string) => void;
  toggleTaskInDev: (id: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, newTitle: string, newDate?: string) => void;
  updateTasksOrder: (tasks: Task[]) => Promise<void>;
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
  const { userId } = useUser();

  const getTasks = useCallback(
    async (userId: string) => {
      if (userId === null) {
        console.warn("getTasks llamado sin userId");
        return;
      }
      setTasksLoading(true);
      try {
        const response = await fetch(`/api/tasks/get?authData=${userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId !== null) {
      getTasks(userId);
    }
  }, [userId, getTasks]);

  const addTask = async (title: string, date?: string) => {
    try {
      const response = await fetch("/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId, date: date ?? null }),
      });
      const data = await response.json();
      setTasks((prev) => [...prev, data[0]]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const editTask = async (id: string, newTitle: string, newDate?: string) => {
    try {
      const response = await fetch("/api/tasks/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: newTitle,
          date: newDate ?? null,
          userId,
        }),
      });
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Error al editar tarea:", error);
    }
  };

  const toggleTaskInDev = async (id: string) => {
    const taskBefore = tasks.find((t) => t.id === id);
    if (!taskBefore) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, in_dev: !task.in_dev } : task,
      ),
    );

    try {
      const res = await fetch("/api/tasks/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, in_dev: !taskBefore.in_dev, userId }),
      });

      if (!res.ok) throw new Error("Error actualizando task");
    } catch (error) {
      console.error("Error en toggleTaskInDev:", error);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, in_dev: taskBefore.in_dev } : task,
        ),
      );
    }
  };

  const removeTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const updateTasksOrder = async (newTasks: Task[]) => {
    const oldTasks = [...tasks];
    setTasks(newTasks);

    try {
      const payload = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
        userId: userId,
      }));

      const res = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error reordenando tareas");
    } catch (error) {
      console.error("Error en updateTasksOrder:", error);
      setTasks(oldTasks); // revertimos si falla
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        tasksLoading,
        getTasks,
        addTask,
        toggleTaskInDev,
        removeTask,
        editTask,
        updateTasksOrder,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
