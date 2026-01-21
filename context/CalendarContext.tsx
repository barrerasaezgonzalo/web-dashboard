"use client";

import {
  CalendarEvent,
  CalendarModalConfig,
  CalendarContextType,
} from "@/types/";
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { authFetch } from "@/hooks/authFetch";
import { useAuth } from "./AuthContext";
import { format } from "date-fns";
import { trackError } from "@/utils/logger";

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const [modalConfig, setModalConfig] = useState<CalendarModalConfig | null>(
    null,
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { userId } = useAuth();

  const getEvents = useCallback(async (mesActual: Date) => {
    try {
      const dateStr = format(mesActual, "yyyy-MM-dd");
      const response = await authFetch(`/api/calendar?date=${dateStr}`);
      if (!response.ok) throw new Error("getEvents: api Error");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      trackError(error, "getEvents");
      setEvents([]);
    }
  }, []);

  const saveEvents = useCallback(
    async (fechaOriginal: string, eventos: CalendarEvent[]) => {
      try {
        const response = await authFetch("/api/calendar", {
          method: "POST",
          body: JSON.stringify({
            userId,
            fecha: fechaOriginal,
            events: eventos.map((ev) => ({
              titulo: ev.titulo,
              notas: ev.notas || "",
              hora: `${ev.hora}:${ev.minutos}:00`,
              fecha: ev.fecha || fechaOriginal,
            })),
          }),
        });
        if (!response.ok) throw new Error("saveEvents: api Error");
        await getEvents(new Date(fechaOriginal));
      } catch (error) {
        trackError(error, "saveEvents");
      }
    },
    [userId, getEvents],
  );

  const handleShowModal = useCallback(
    (dia: Date) => {
      setModalConfig({
        date: dia,
        onConfirm: async (eventos: CalendarEvent[]) => {
          await saveEvents(format(dia, "yyyy-MM-dd"), eventos);
          setModalConfig(null);
          getEvents(new Date());
        },
        onCancel: () => setModalConfig(null),
      });
    },
    [saveEvents, getEvents],
  );

  return (
    <CalendarContext.Provider
      value={{
        events,
        getEvents,
        saveEvents,
        modalConfig,
        handleShowModal,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
