import { supabase } from "@/lib/supabaseClient";
import { Financial } from "@/types/";
import { roundToThousands } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

const SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Financial>,
) {
  const financial = await getFinancial();
  res.status(200).json(financial);
}

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

export async function getFinancial(): Promise<Financial> {
  try {
    const FinancialRes = await fetch(`https://mindicador.cl/api`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!FinancialRes.ok) {
      throw new Error(`API Miindicador falló: HTTP ${FinancialRes.status}`);
    }
    const financialJson = await FinancialRes.json();

    const CriptoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=clp`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!CriptoRes.ok) {
      throw new Error(`API Coingecko falló: HTTP ${CriptoRes.status}`);
    }
    const CriptoJson = await CriptoRes.json();

    // 1. Estado actual (para UI)
    const currentData = {
      dolar: Number(financialJson.dolar?.valor) || 0,
      utm: Number(financialJson.utm?.valor) || 0,
      btc: Number(CriptoJson.bitcoin?.clp) || 0,
      eth: Number(CriptoJson.ethereum?.clp) || 0,
    };

    // 2. Snapshot normalizado (para historial / gráficas)
    const snapshot = {
      ...currentData,
      btc: roundToThousands(currentData.btc),
      eth: roundToThousands(currentData.eth),
    };

    // 3. Último snapshot guardado
    const { data: lastRecord } = await supabase
      .from("financial_history")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const now = Date.now();
    const lastTime = lastRecord ? new Date(lastRecord.created_at).getTime() : 0;

    // 4. Guardar solo si pasó suficiente tiempo
    if (now - lastTime > SNAPSHOT_INTERVAL_MS) {
      const { error } = await supabase
        .from("financial_history")
        .insert([snapshot]);

      if (error) {
        console.error("Error insertando snapshot:", error);
      }
    }

    // 5. Historial para la gráfica
    const { data: financialHistory } = await supabase
      .from("financial_history")
      .select("*")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    return {
      current: currentData,
      history: financialHistory || [],
    };
  } catch (error) {
    console.error("Error fetching finanzas:", error);
    return {
      current: { dolar: 0, utm: 0, btc: 0, eth: 0 },
      history: [],
      _fallback: true,
    };
  }
}
