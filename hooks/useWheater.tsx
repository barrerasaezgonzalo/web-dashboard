import { useState, useCallback, useEffect } from "react";
import { WheaterResponse } from "@/types/";
import { trackError } from "@/utils/logger";
import { authFetch } from "./authFetch";

export const useWheater = () => {
  const [weather, setWeather] = useState<WheaterResponse | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await authFetch("/api/weather", {
        method: "GET",
      });
      if (!res.ok) throw new Error("fetchWeather: api Error");
      const data: WheaterResponse = await res.json();
      setWeather(data);
    } catch (error) {
      trackError(error, "fetchWeather");
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
