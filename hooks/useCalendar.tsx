import { useAuth } from "@/context/AuthContext";
import { CalendarEvent, CalendarModalConfig } from "@/types";
import { format } from "date-fns";
import { useCallback, useContext, useEffect, useState } from "react";
import { authFetch } from "./authFetch";
import { CalendarContext } from "@/context/CalendarContext";

export const useCalendar = (mesActual: Date) => {
  const { userId } = useAuth();
  // Sacamos todo del context
  const { events, getEvents, saveEvents } = useContext(CalendarContext)!;

  const [modalConfig, setModalConfig] = useState<CalendarModalConfig | null>(
    null,
  );

  const handleShowModal = useCallback(
    (dia: Date) => {
      setModalConfig({
        date: dia,
        onConfirm: async (eventosDesdeElModal: any[]) => {
          const fechaDB = format(dia, "yyyy-MM-dd");
          // Llamamos a la función del provider que ya tiene la lógica del POST
          await saveEvents(fechaDB, eventosDesdeElModal);
          setModalConfig(null);
        },
        onCancel: () => setModalConfig(null),
      });
    },
    [saveEvents], // Mucho más limpio, solo dependes de saveEvents
  );

  useEffect(() => {
    getEvents(mesActual);
  }, [getEvents, mesActual]);

  return {
    events,
    modalConfig,
    handleShowModal,
    closeModal: () => setModalConfig(null),
  };
};
