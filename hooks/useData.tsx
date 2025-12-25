import { useState, useEffect, useCallback } from "react";
import { WheaterResponse } from "@/types";
import { useUser } from "@/context/UserContext";

export const useData = () => {
  const { userId } = useUser();

  // Estados
  const [prompt, setPrompt] = useState("");
  const [note, setNote] = useState<string>("");
  const [wheater, setWheather] = useState<WheaterResponse | null>(null);

  // Función para generar prompt
  const getPrompt = useCallback(
    async (input?: string): Promise<string | null> => {
      if (!input) return null;

      try {
        const res = await fetch("/api/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        });
        const result = await res.json();
        if (result.data) {
          setPrompt(result.data);
          return result.data;
        }
        console.error("No se recibió data del endpoint", result);
        return null;
      } catch (error) {
        console.error("Error al generar prompt:", error);
        return null;
      }
    },
    [],
  );

  // Guardar nota con debounce
  let saveTimeout: NodeJS.Timeout;
  const saveNote = useCallback(
    (content: string) => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        if (!userId) return;
        try {
          await fetch("/api/note", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, userId }),
          });
        } catch (err) {
          console.error("Error saving note:", err);
        }
      }, 1000);
    },
    [userId],
  );

  // Traer nota del usuario
  useEffect(() => {
    if (!userId) return;

    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/note?authData=${userId}`);
        const data = await res.json();
        setNote(data.content || "");
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [userId]);

  // Traer clima
  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch("/api/weather");
      const data: WheaterResponse = await res.json();
      setWheather(data);
    } catch {
      console.error("Error al obtener Clima");
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    prompt,
    getPrompt,
    note,
    setNote,
    saveNote,
    wheater,
    setWheather,
  };
};
