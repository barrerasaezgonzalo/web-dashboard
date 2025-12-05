import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | Task[] | { error: string }>,
) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("order", { ascending: true });
    if (error) {
      console.error("Error al obtener task:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data || []);
  }

  if (req.method === "POST") {
    const { title } = req.body;

    // 1️⃣ Obtener el máximo order actual
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from("todos")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error("Error al obtener max order:", maxOrderError);
      return res.status(500).json({ error: maxOrderError.message });
    }

    const nextOrder =
      maxOrderData && maxOrderData.length > 0
        ? (maxOrderData[0].order ?? 0) + 1
        : 1;

    // 2️⃣ Insertar la nueva task con el order calculado
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, completed: false, order: nextOrder }])
      .select();

    if (error) {
      console.error("Error al crear task:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data || []);
  }

  if (req.method === "PATCH") {
    const { id, title, completed } = req.body;

    const updates: Partial<Task> = {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;

    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) {
      return res.status(404).json({ error: "Task no encontrada" });
    }
    return res.status(200).json(data[0]);
  }

  res.setHeader("Allow", ["GET", "POST", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
