import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

    if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

    if (req.method === "POST") {
    const { title } = req.body;

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

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, in_dev: false, order: nextOrder }])
      .select();

    if (error) {
      console.error("Error al crear task:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data || []);
  }

}