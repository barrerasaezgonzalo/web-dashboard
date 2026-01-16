import { useContext, useEffect } from "react";
import { CalendarContext } from "@/context/CalendarContext";

export const useCalendar = (mesActual?: Date) => {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider");

  const { events, modalConfig, handleShowModal, getEvents } = context;

  useEffect(() => {
    if (mesActual) getEvents(mesActual);
  }, [mesActual, getEvents]);

  return { events, modalConfig, handleShowModal };
};
