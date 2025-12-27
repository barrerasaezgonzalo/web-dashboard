import { useState, useCallback, useEffect } from "react";
import { WheaterResponse } from "@/types/";

export const useData = () => {
  const [wheater, setWheather] = useState<WheaterResponse | null>(null);
  const [prompt, setPrompt] = useState("");

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
    wheater,
    prompt,
    getPrompt,
  };
};
