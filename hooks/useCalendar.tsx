import { CalendarModalConfig } from "@/types";
import { format } from "date-fns";
import { useCallback, useContext, useEffect, useState } from "react";
import { CalendarContext } from "@/context/CalendarContext";

export const useCalendar = (mesActual: Date) => {
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
          await saveEvents(fechaDB, eventosDesdeElModal);
          setModalConfig(null);
          getEvents(mesActual);
        },
        onCancel: () => setModalConfig(null),
      });
    },
    [saveEvents],
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
