"use client";

import { Task } from "@/types";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

interface TaskContextType {
  tasks: Task[];
  tasksLoading: boolean;
  getTasks: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTaskInDev: (id: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
  updateTasksOrder: (tasks: Task[]) => Promise<void>;
}

export const TasksContext = createContext<TaskContextType | undefined>(
  undefined,
);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [authData, setAuthData] = React.useState<string | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("authDashboard");
    if (storedValue) {
      setAuthData(storedValue);
    } else {
      setAuthData("");
    }
  }, []);

  const getTasks = useCallback(async () => {
    if (authData === null) {
      console.warn("getTasks llamado antes de que authData se cargue.");
      return;
    }
    setTasksLoading(true);
    try {
      const response = await fetch(`/api/tasks/get?authData=${authData}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [authData]);

  useEffect(() => {
    if (authData !== null) {
      getTasks();
    }
  }, [authData, getTasks]);

  const addTask = async (title: string) => {
    try {
      const response = await fetch("/api/tasks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, authData }),
      });
      const data = await response.json();
      setTasks((prev) => [...prev, data[0]]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    try {
      const response = await fetch("/api/tasks/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: newTitle }),
      });
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Error al editar tarea:", error);
    }
  };

  const toggleTaskInDev = async (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, in_dev: !task.in_dev } : task,
      ),
    );

    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const res = await fetch("/api/tasks/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, in_dev: !task.in_dev }),
      });

      if (!res.ok) throw new Error("Error actualizando task");
    } catch (error) {
      console.error("Error en toggleTaskInDev:", error);
      // opcional: revertir el cambio local si falla
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, in_dev: task.in_dev } : task,
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

  useEffect(() => {
    getTasks();
  }, []);

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
