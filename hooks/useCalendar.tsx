import { useUser } from "@/context/UserContext";
import { CalendarEvent, CalendarModalConfig } from "@/types";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export const useCalendar = (mesActual: Date) => {
  const { userId } = useUser();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalConfig, setModalConfig] = useState<CalendarModalConfig | null>(
    null,
  );

  const fetchEvents = useCallback(async () => {
    if (!mesActual || !userId) return;
    const dateStr = format(mesActual, "yyyy-MM-dd");

    try {
      const res = await fetch(
        `/api/calendar?authData=${userId}&date=${dateStr}`,
      );
      if (!res.ok) throw new Error("Error en la respuesta de la red");
      const data: CalendarEvent[] = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, [userId, mesActual]);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  const handleShowModal = useCallback(
    (dia: Date) => {
      setModalConfig({
        date: dia,
        onConfirm: async (eventosDesdeElModal: any[]) => {
          try {
            const fechaDB = format(dia, "yyyy-MM-dd");
            await fetch("/api/calendar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                fecha: fechaDB,
                events: eventosDesdeElModal.map((ev) => ({
                  ...ev,
                  hora: `${ev.hora}:${ev.minutos}:00`,
                })),
              }),
            });

            await fetchEvents();
            setModalConfig(null);
          } catch (error) {
            console.error("Error al guardar:", error);
          }
        },
        onCancel: () => setModalConfig(null),
      });
    },
    [userId, fetchEvents],
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    modalConfig,
    handleShowModal,
    closeModal,
  };
};
