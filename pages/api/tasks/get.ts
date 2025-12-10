import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET")
        return res.status(405).json({ error: "Method not allowed" });

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



}