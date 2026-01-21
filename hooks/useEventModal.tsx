// hooks/useEventModal.ts
import { useState, useMemo, useContext } from "react";
import { useToast } from "@/hooks/useToast";
import { CalendarEvent } from "@/types";
import { CalendarContext } from "@/context/CalendarContext";

export const useEventModal = (
  eventsToday: CalendarEvent[],
  date: string,
  onConfirm: (eventos: CalendarEvent[]) => Promise<void>,
) => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useEventModal must be used within provider");

  const [isSaving, setIsSaving] = useState(false);
  const { openToast, closeToast } = useToast();
  const [snapshotInicial] = useState(() => JSON.stringify(context.events));

  const formattedEvents = useMemo(() => {
    return (eventsToday || []).map((ev: CalendarEvent) => {
      let isoDate = ev.date || date;
      if (isoDate.includes("/")) {
        isoDate = isoDate.split("/").reverse().join("-");
      }

      return {
        ...ev,
        date: isoDate,
        notes: ev.notes || "",
        hour: ev.hour?.split(":")[0] || "09",
        minutes: ev.hour?.split(":")[1] || "00",
      };
    });
  }, [eventsToday, date]);
  const [localEvents, setLocalEvents] = useState(formattedEvents);

  const handleUpdate = (index: number, field: string, value: string) => {
    setLocalEvents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeEvent = (index: number) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar el evento?",
      onConfirm: () => {
        setLocalEvents((prev) => prev.filter((_, i) => i !== index));
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  const addNewEvent = () => {
    if (
      localEvents.length > 0 &&
      !localEvents[localEvents.length - 1].title.trim()
    )
      return;
    setLocalEvents([
      ...localEvents,
      { title: "", notes: "", hour: "09", minutes: "00", date: date },
    ]);
  };

  const areEmptyFields =
    localEvents.length > 0 && localEvents.some((ev) => !ev.title?.trim());

  const hasChanged = useMemo(() => {
    return JSON.stringify(localEvents) !== snapshotInicial;
  }, [localEvents, snapshotInicial]);
  const blockedButton = areEmptyFields || isSaving || !hasChanged;

  const handleConfirm = async () => {
    if (blockedButton) return;
    setIsSaving(true);
    try {
      await onConfirm(localEvents);
      openToast({ message: "¡Eventos guardados correctamente!" });
    } catch {
      setIsSaving(false);
      openToast({ message: "Error al guardar los eventos" });
    }
  };

  return {
    localEvents,
    isSaving,
    blockedButton,
    handleUpdate,
    removeEvent,
    addNewEvent,
    handleConfirm,
    events: context.events,
  };
};
