import { useState, useCallback, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";

export const useData = () => {
  const { userId } = useUser();

  const [note, setNote] = useState<{ id: string; content: string }>();
  const [notes, setNotes] = useState<{ id: string; content: string }[]>([]);

  // guardamos el timeout en un ref para que no se pierda entre renders
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Guardar nota con debounce
  const saveNote = useCallback(
    (content: string, noteId: string) => {
      if (!userId) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      clearTimeout(saveTimeout.current || 0);
      saveTimeout.current = setTimeout(async () => {
        try {
          await fetch("/api/note", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, userId, noteId }),
          });

          // actualizar nota en la lista
          setNotes((prev) =>
            prev.map((n) => (n.id === noteId ? { ...n, content } : n)),
          );

          // actualizar nota activa si corresponde
          setNote((prev) =>
            prev?.id === noteId ? { ...prev, content } : prev,
          );
        } catch (err) {
          console.error("Error saving note:", err);
        }
      }, 1000);
    },
    [userId],
  );

  const createNote = useCallback(
    async (content = "") => {
      if (!userId) return;
      try {
        const res = await fetch("/api/note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, userId }),
        });
        const data = await res.json();
        if (data) setNotes((prev) => [...prev, data]);
        return data;
      } catch (err) {
        console.error("Error creating note:", err);
      }
    },
    [userId],
  );

  // Traer todas las notas y solo inicializar nota activa la primera vez
  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/note?authData=${userId}`);
      const data = await res.json();
      setNotes(data || []);

      // inicializar nota activa solo si no hay ninguna
      setNote((prev) => (prev ? prev : data[0]));
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [userId]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await fetch(`/api/note?noteId=${id}&authData=${userId}`, {
        method: "DELETE",
      });

      // Actualizamos el listado local
      setNotes((prev) => prev.filter((n) => n.id !== id));

      // Si la nota activa era la eliminada, limpiamos el textarea
      setNote((prev) => (prev?.id === id ? undefined : prev));
    } catch (err) {
      console.error("Error eliminando nota:", err);
    }
  }, []);

  const createNoteAPI = async (content: string, userId: string) => {
    try {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error creando nota:", err);
        return null;
      }

      const data = await res.json();
      // data debe contener { id, content, auth_data, created_at, updated_at }
      return data;
    } catch (err) {
      console.error("Error creando nota:", err);
      return null;
    }
  };

  // inicializar al montar
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    note,
    setNote,
    saveNote,
    notes,
    fetchNotes,
    createNote,
    deleteNote,
    createNoteAPI,
  };
};
