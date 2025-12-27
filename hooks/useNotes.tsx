import { useUser } from "@/context/UserContext";
import { Note } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useNotes = () => {
  const { userId } = useUser();

  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/note?authData=${userId}`);
      const data: Note[] = await res.json();

      for (const n of data) {
        if (n.content.trim() === "") {
          await fetch(`/api/note?noteId=${n.id}&authData=${userId}`, {
            method: "DELETE",
          });
        }
      }

      const filtered = data.filter((n) => (n.content ?? "").trim() !== "");
      setNotes(filtered);
      setNote(filtered.length > 0 ? filtered[0] : null);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [userId]);

  const saveNote = useCallback(
    (content: string, noteId: string) => {
      if (!userId) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        await fetch(`/api/note?authData=${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, noteId }),
        });

        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, content } : n)),
        );
      }, 500);
    },
    [userId],
  );

  const createNote = useCallback(async () => {
    if (!userId) return;

    const res = await fetch(`/api/note?authData=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "" }),
    });

    if (!res.ok) return null;

    const newNote = await res.json();

    setNotes((prev) => [
      newNote,
      ...prev.filter((n) => n.content.trim() !== ""),
    ]);

    setNote(newNote);

    return newNote;
  }, [userId]);

  const deleteNote = useCallback(
    async (id: string) => {
      await fetch(`/api/note?noteId=${id}&authData=${userId}`, {
        method: "DELETE",
      });

      setNotes((prev) => prev.filter((n) => n.id !== id));
      setNote((prev) => (prev?.id === id ? null : prev));
    },
    [userId],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (!note?.id) return;
      setNote({ ...note, content: value });
      saveNote(value, note.id);
    },
    [note, saveNote],
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    note,
    setNote,
    notes,
    createNote,
    deleteNote,
    handleChange,
  };
};
