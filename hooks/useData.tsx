import { useState, useCallback, useEffect } from "react";
import { WheaterResponse } from "@/types/";

export const useWheater = () => {
  const [wheater, setWheather] = useState<WheaterResponse | null>(null);

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
  };
};
