// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const noteId = "11111111-1111-1111-1111-111111111111";
  if (req.method === "GET") {
    const { authData } = req.query;
    const { data, error } = await supabase
      .from("notes")
      .select("content")
      .eq("id", noteId)
      .eq("auth_data", authData)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || { content: "" });
  }

  if (req.method === "POST" || req.method === "PUT") {
    const { content, userId } = req.body;

    const { data, error } = await supabase
      .from("notes")
      .update({ content })
      .eq("id", noteId)
      .eq("auth_data", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
