import { useState, useCallback, useEffect } from "react";
import { WheaterResponse } from "@/types/";

export const useWheater = () => {
  const [weather, setWeather] = useState<WheaterResponse | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error("Fetch failed");
      const data: WheaterResponse = await res.json();
      setWeather(data);
    } catch (error) {
      console.error("Error al obtener Clima:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchWeather().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [fetchWeather]);

  return {
    weather,
  };
};
