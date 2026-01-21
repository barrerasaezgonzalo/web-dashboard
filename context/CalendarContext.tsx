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

  const getEvents = useCallback(async (currentMonth: Date) => {
    try {
      const dateStr = format(currentMonth, "yyyy-MM-dd");
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
            date: fechaOriginal,
            events: eventos.map((ev) => ({
              title: ev.title,
              notes: ev.notes || "",
              hour: `${ev.hour}:${ev.minutes}:00`,
              date: ev.date || fechaOriginal,
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
    (newDay: Date) => {
      setModalConfig({
        date: newDay,
        onConfirm: async (eventos: CalendarEvent[]) => {
          await saveEvents(format(newDay, "yyyy-MM-dd"), eventos);
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
