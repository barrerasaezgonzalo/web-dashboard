"use client";

import { CalendarEvent, CalendarModalConfig } from "@/types/";
import React, { createContext, useState, ReactNode, useCallback } from "react";
import { authFetch } from "@/hooks/authFetch";
import { useAuth } from "./AuthContext";
import { format } from "date-fns";

export interface CalendarContextType {
  events: CalendarEvent[];
  getEvents: (m: Date) => void;
  saveEvents: (fecha: string, eventos: any[]) => Promise<void>;
  modalConfig: CalendarModalConfig | null;
  handleShowModal: (dia: Date) => void;
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
  const [modalConfig, setModalConfig] = useState<CalendarModalConfig | null>(
    null,
  );
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

  const saveEvents = async (fecha: string, eventos: any[]) => {
    try {
      await authFetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          userId,
          fecha,
          events: eventos.map((ev) => ({
            titulo: ev.titulo,
            notas: ev.notas || "",
            hora: `${ev.hora}:${ev.minutos}:00`,
          })),
        }),
      });
      await getEvents(new Date(fecha));
    } catch (error) {
      console.error("Error al guardar en Provider:", error);
      throw error;
    }
  };

  const handleShowModal = useCallback(
    (dia: Date) => {
      setModalConfig({
        date: dia,
        onConfirm: async (eventos) => {
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
