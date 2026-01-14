"use client";

import { CalendarEvent } from "@/types/";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { authFetch } from "@/hooks/authFetch";
import { useAuth } from "./AuthContext";
import { format } from "date-fns";

export interface CalendarContextType {
  events: CalendarEvent[];
  getEvents: (m: Date) => void;
  saveEvents: (fecha: string, eventos: any[]) => Promise<void>;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { userId } = useAuth();
  const getEvents = useCallback(async (mesActual: Date) => {
    try {
      const dateStr = format(mesActual, "yyyy-MM-dd");
      const response = await authFetch(`/api/calendar?date=${dateStr}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.log("Error al obtener getEvents:", error);
      setEvents([]);
    }
  }, []);

  // Dentro del Provider
  const saveEvents = async (fecha: string, eventos: any[]) => {
    try {
      await authFetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          userId,
          fecha,
          events: eventos.map((ev) => ({
            ...ev,
            hora: `${ev.hora}:${ev.minutos}:00`,
          })),
        }),
      });
      // Después de guardar, refrescamos la lista
      await getEvents(new Date(fecha));
    } catch (error) {
      console.error("Error al guardar en Provider:", error);
      throw error;
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        getEvents,
        saveEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
