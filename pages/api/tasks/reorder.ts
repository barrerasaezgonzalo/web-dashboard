import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: "Method not allowed" });

  const tasks: { id: string; order: number; userId: number }[] = req.body;

  try {
    await Promise.all(
      tasks.map((task) =>
        supabase
          .from("todos")
          .update({ order: task.order })
          .eq("id", task.id)
          .eq("auth_data", task.userId),
      ),
    );

    res.status(200).json({ message: "Orden actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando el orden" });
  }
}
