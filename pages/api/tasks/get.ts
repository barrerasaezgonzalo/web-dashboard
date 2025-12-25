import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  if (req.method === "GET") {
    const { authData } = req.query;
    if (!authData || typeof authData !== "string") {
      return res
        .status(400)
        .json({ error: "Falta o es inválido el parámetro 'authData'." });
    }
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("auth_data", authData)
      .order("date", { ascending: true });
    if (error) {
      console.error("Error al obtener task:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data || []);
  }
}
