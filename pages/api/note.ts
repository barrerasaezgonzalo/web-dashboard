// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient"; // ajusta la ruta según tu proyecto

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const noteId = "11111111-1111-1111-1111-111111111111"; // id fijo para tu nota personal

  if (req.method === "GET") {
    // Traer la nota
    const { data, error } = await supabase
      .from("notes")
      .select("content")
      .eq("id", noteId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || { content: "" });
  }

  if (req.method === "POST" || req.method === "PUT") {
    const { content } = req.body;

    // Crear o actualizar la nota
    const { data, error } = await supabase
      .from("notes")
      .upsert({ id: noteId, content })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
