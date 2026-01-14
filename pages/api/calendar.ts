// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body, query, method } = req;
  const { authData } = query;
  let { userId } = method === "DELETE" ? query : body;

  const effectiveUserId =
    userId || (Array.isArray(authData) ? authData[0] : authData);

  if (!effectiveUserId) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("auth_data", effectiveUserId)
        .order("fecha", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    if (method === "POST") {
      const { fecha, events } = body;

      if (!fecha) return res.status(400).json({ error: "Fecha requerida" });

      const { error: deleteError } = await supabase
        .from("calendar")
        .delete()
        .eq("auth_data", effectiveUserId)
        .eq("fecha", fecha);

      if (deleteError) throw deleteError;

      if (events && events.length > 0) {
        const eventsToInsert = events.map((ev: any) => ({
          auth_data: effectiveUserId,
          fecha: fecha,
          titulo: ev.titulo,
          notas: ev.descripcion || "",
          hora: ev.hora,
        }));

        const { error: insertError } = await supabase
          .from("calendar")
          .insert(eventsToInsert);

        if (insertError) throw insertError;
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
