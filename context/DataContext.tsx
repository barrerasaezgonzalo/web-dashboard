"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import type { Task, News, Financial, TopSite } from "../types";

export interface DataContextType {
  usuario: string;

  tasks: Task[];
  tasksLoading: boolean;
  getTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (title: string) => void;
  toggleTaskCompletion: (id: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
  updateTasksOrder: (tasks: Task[]) => Promise<void>;
  news: News;
  newsLoading: boolean;
  getNews: () => Promise<void>;
  financial: Financial;
  financialLoading: boolean;
  getFinancial: () => Promise<void>;
  clima: string;
  weatherLoading: boolean;
  getWeather: () => Promise<void>;
  prompt: string;
  getPrompt: (input?: string) => Promise<string | null>;
  topSites: TopSite[];
  getNote: () => Promise<void>;
  saveNote: (note: string) => void;
  note: string;
  setNote: (note: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Estados principales
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const [news, setNews] = useState<News>({ totalArticles: 0, articles: [] });
  const [newsLoading, setNewsLoading] = useState(false);

  const [financial, setFinancial] = useState<Financial>({
    dolar: "0",
    utm: "0",
    btc: "0",
    eth: "0",
  });
  const [financialLoading, setFinancialLoading] = useState(false);

  const [clima, setClima] = useState("Cargando...");
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [prompt, setPrompt] = useState("");

  const [usuario] = useState("barrerasaezgonzalo");
  const [topSites] = useState<TopSite[]>([]);
  const [note, setNote] = useState<string>("");

  // ===================== Métodos ===================== //

  const getTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      setTasks((prev) => [...prev, data[0]]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    try {
      const response = await fetch("/api/tasks", {
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

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const removeTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const updateTasksOrder = async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      // Creamos payload con id y order
      const payload = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
      }));

      // Llamamos a la API que reordena en Supabase
      const res = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error reordenando tareas");

      // Actualizamos estado local
      setTasks(newTasks);
    } catch (error) {
      console.error("Error en updateTasksOrder:", error);
    }
  };

  const getNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error al obtener noticias:", error);
      setNews({ totalArticles: 0, articles: [] });
    } finally {
      setNewsLoading(false);
    }
  };

  const getFinancial = async () => {
    setFinancialLoading(true);
    try {
      const response = await fetch("/api/financial");
      const data = await response.json();
      setFinancial(data);
    } catch (error) {
      console.error("Error al obtener finanzas:", error);
      setFinancial({ dolar: "0", utm: "0", btc: "0", eth: "0" });
    } finally {
      setFinancialLoading(false);
    }
  };

  const getWeather = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch("/api/weather");
      const data = await response.json();
      setClima(data.temperatura);
    } catch (error) {
      console.error("Error al obtener clima:", error);
      setClima("0°C");
    } finally {
      setWeatherLoading(false);
    }
  };

  const getPrompt = async (input?: string): Promise<string | null> => {
    if (!input) return null;
    try {
      const response = await fetch("/api/promt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const result = await response.json();
      if (result.data) {
        setPrompt(result.data);
        return result.data;
      } else {
        console.error("No se recibió data del endpoint", result);
        return null;
      }
    } catch (error) {
      console.error("Error al generar prompt:", error);
      return null;
    }
  };

  const getNote = async () => {
    try {
      const res = await fetch("/api/note");
      const data = await res.json();
      setNote(data.content || "");
    } catch (err) {
      console.error("Error fetching note:", err);
    }
  };

  let saveTimeout: NodeJS.Timeout;

  const saveNote = (content: string) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        await fetch("/api/note", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch (err) {
        console.error("Error saving note:", err);
      }
    }, 1000);
  };

  // ===================== useEffect inicial ===================== //
  useEffect(() => {
    getTasks();
    getNews();
    getFinancial();
    getWeather();
    getNote();
  }, []);

  // ===================== Provider ===================== //
  return (
    <DataContext.Provider
      value={{
        tasks,
        tasksLoading,
        getTasks,
        setTasks,
        addTask,
        toggleTaskCompletion,
        removeTask,
        editTask,
        updateTasksOrder,
        news,
        newsLoading,
        getNews,
        financial,
        financialLoading,
        getFinancial,
        clima,
        weatherLoading,
        getWeather,
        prompt,
        getPrompt,
        usuario,
        topSites,
        note,
        setNote,
        saveNote,
        getNote,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
