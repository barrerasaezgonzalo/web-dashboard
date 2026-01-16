// hooks/useEventModal.ts
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";

export const useEventModal = (
  eventsToday: any[],
  date: string,
  onConfirm: any,
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const initialEventsRef = useRef<string>("");
  const { openToast, closeToast } = useToast();

  useEffect(() => {
    const formatted = (eventsToday || []).map((ev: any) => ({
      ...ev,
      notas: ev.notas || "",
      hora: ev.hora?.split(":")[0] || "09",
      minutos: ev.hora?.split(":")[1] || "00",
    }));
    setLocalEvents(formatted);
    initialEventsRef.current = JSON.stringify(formatted);
  }, [date, eventsToday]);

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
      !localEvents[localEvents.length - 1].titulo.trim()
    )
      return;
    setLocalEvents([
      ...localEvents,
      { titulo: "", notas: "", hora: "09", minutos: "00" },
    ]);
  };

  const hayCamposVacios =
    localEvents.length > 0 && localEvents.some((ev) => !ev.titulo?.trim());
  const hanCambiado = JSON.stringify(localEvents) !== initialEventsRef.current;
  const botonBloqueado = hayCamposVacios || isSaving || !hanCambiado;

  const handleConfirm = async () => {
    if (botonBloqueado) return;
    setIsSaving(true);
    try {
      await onConfirm(localEvents);
      openToast({ message: "¡Eventos guardados correctamente!" });
    } catch (error) {
      setIsSaving(false);
      openToast({ message: "Error al guardar los eventos" });
    }
  };

  return {
    localEvents,
    isSaving,
    botonBloqueado,
    handleUpdate,
    removeEvent,
    addNewEvent,
    handleConfirm,
  };
};
