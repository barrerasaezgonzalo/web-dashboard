// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers["authorization"] || req.headers.authorization;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado. Falta token." });
  }
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Token inválido" });

  const userId = user.id;

  try {
    if (req.method === "GET") {
      if (!userId) return res.status(400).json({ error: "Faltan datos" });
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .eq("auth_data", userId)
        .order("fecha", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      const { fecha, events } = req.body;

      if (!fecha) return res.status(400).json({ error: "Fecha requerida" });

      const { error: deleteError } = await supabase
        .from("calendar")
        .delete()
        .eq("auth_data", userId)
        .eq("fecha", fecha);

      if (deleteError) throw deleteError;

      if (events && events.length > 0) {
        const eventsToInsert = events.map((ev: any) => ({
          auth_data: userId,
          fecha: fecha,
          titulo: ev.titulo,
          notas: ev.notas || "",
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
