import { useContext, useEffect } from "react";
import { CalendarContext } from "@/context/CalendarContext";

export const useCalendar = (currentMonth?: Date) => {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider");

  const { events, modalConfig, handleShowModal, getEvents } = context;

  useEffect(() => {
    if (currentMonth) getEvents(currentMonth);
  }, [currentMonth, getEvents]);

  return { events, modalConfig, handleShowModal };
};
