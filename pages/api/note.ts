// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body, query, method } = req;

  // Para DELETE viene en query
  const { authData } = query;
  const { content, noteId } = body || {};
  let { userId } = method === "DELETE" ? query : body;

  // Si authData es un array (Next.js lo hace cuando hay multiples params), tomamos el primero
  const effectiveUserId =
    userId || (Array.isArray(authData) ? authData[0] : authData);

  if (!effectiveUserId) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    if (method === "GET") {
      // traer todas las notas del usuario
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("auth_data", effectiveUserId)
        .order("updated_at", { ascending: true });

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data || []);
    }

    if (method === "POST") {
      // crear nueva nota en blanco o con contenido
      const { data, error } = await supabase
        .from("notes")
        .insert([{ content: content || "", auth_data: effectiveUserId }])
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data);
    }

    if (method === "PUT") {
      if (!noteId)
        return res.status(400).json({ error: "noteId es requerido" });

      const { data, error } = await supabase
        .from("notes")
        .update({ content })
        .eq("id", noteId)
        .eq("auth_data", effectiveUserId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json(data);
    }

    if (method === "DELETE") {
      let { authData, noteId } = query;
      if (!noteId || !authData)
        return res.status(400).json({ error: "id y authData son requeridos" });

      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("auth_data", authData);

      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: false });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
