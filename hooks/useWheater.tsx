import { useEffect, useState } from "react";

interface WheaterResponse {
  temperatura: string;
}

export const useWheater = () => {
  const [wheater, setWheather] = useState<WheaterResponse | null>(null);
  const [loadingWheater, setLoadingWheather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWheater = async () => {
    setLoadingWheather(true);
    try {
      const res = await fetch("/api/weather");
      const data: WheaterResponse = await res.json();
      setWheather(data);
    } catch {
      setError("Error cargando clima");
    } finally {
      setLoadingWheather(false);
    }
  };

  useEffect(() => {
    fetchWheater();
  }, []);

  return { wheater, loadingWheater, error };
};
