import { useUser } from "@/context/UserContext";
import { Note } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useNotes = () => {
  const [note, setNote] = useState<Note>();
  const [notes, setNotes] = useState<Note[]>([]);
  const { userId } = useUser();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isCreatingRef = useRef(false);

  const saveNote = useCallback(
    (content: string, noteId: string) => {
      if (!userId) return;
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(async () => {
        try {
          await fetch(`/api/note?authData=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, userId, noteId }),
          });

          setNotes((prev) =>
            prev.map((n) => (n.id === noteId ? { ...n, content } : n)),
          );

          setNote((prev) =>
            prev?.id === noteId ? { ...prev, content } : prev,
          );
        } catch (err) {
          console.error("Error saving note:", err);
        }
      }, 500);
    },
    [userId],
  );

  const createNote = async () => {
    if (!note || !userId) return;

    try {
      saveNote(note.content, note.id);
      const res = await fetch(`/api/note?authData=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "" }),
      });

      const newNote = await res.json();
      setNote(newNote);
      fetchNotes();
    } catch (err) {
      console.error("Error creando nueva nota:", err);
    }
  };

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/note?authData=${userId}`);
      const data = await res.json();
      setNotes(data || []);

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

      setNotes((prev) => prev.filter((n) => n.id !== id));
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
      fetchNotes();
      return data;
    } catch (err) {
      console.error("Error creando nota:", err);
      return null;
    }
  };

  const draftRef = useRef("");
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      draftRef.current = value;

      setNote((prev) => (prev ? { ...prev, content: value } : prev));
      const noteId = note?.id;
      if (!noteId && userId && !isCreatingRef.current) {
        isCreatingRef.current = true;

        const newNote = await createNoteAPI(draftRef.current, userId);
        if (newNote) {
          setNote({ ...newNote, content: draftRef.current });
        }

        isCreatingRef.current = false;
        return;
      }
      if (noteId) {
        saveNote(draftRef.current, noteId);
      }
    },
    [note?.id, userId, saveNote],
  );

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
    handleChange,
  };
};
