import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { PersonalFinanceMovement } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { authData } = req.query;
    const { data, error } = await supabase
      .from("movements")
      .select("*")
      .eq("auth_data", authData)
      .order("date", { ascending: false });
    if (error) {
      console.error("Error al obtener personal finances:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data || []);
  }

  if (req.method === "POST") {
    const { authData } = req.query;
    const { newMovement } = req.body;
    const { type, date, value, category } = newMovement;
    const { data, error } = await supabase
      .from("movements")
      .insert([
        {
          type,
          date,
          value,
          category,
          auth_data: authData,
        },
      ])
      .select();

    if (error) {
      console.error("Error al crear personal finance:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data || []);
  }

  if (req.method === "PATCH") {
    const { authData } = req.query;
    const { updatedMovement } = req.body;
    const { id, type, date, value, category } = updatedMovement;
    const updates: Partial<PersonalFinanceMovement> = {};
    if (type !== undefined) updates.type = type;
    if (value !== undefined) updates.value = value;
    if (category !== undefined) updates.category = category;
    const { data, error } = await supabase
      .from("movements")
      .update(updates)
      .eq("auth_data", authData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error al actualizar personal finance:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data || []);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const { error: deleteError } = await supabase
      .from("movements")
      .delete()
      .eq("id", id);

    if (deleteError)
      return res.status(500).json({ error: deleteError.message });

    return res.status(200).json({ success: true });
  }
}
