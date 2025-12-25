import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (req.method === "POST") {
    const { title, userId, date } = req.body;

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          title,
          in_dev: false,
          auth_data: userId,
          date: date,
        },
      ])
      .select();

    if (error) {
      console.error("Error al crear task:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data || []);
  }
}
