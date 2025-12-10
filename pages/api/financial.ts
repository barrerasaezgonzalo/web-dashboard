import { supabase } from "@/lib/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export interface FinancialData {
  current: {
    dolar: number;
    utm: number;
    btc: number;
    eth: number;
  };
  history: {
    id: string;
    created_at: string;
    dolar: number;
    utm: number;
    btc: number;
    eth: number;
  }[];
  _fallback?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FinancialData>,
) {
  const financial = await getFinancial();
  res.status(200).json(financial);
}

export async function getFinancial(): Promise<FinancialData> {
  try {
    // Datos de mindicador.cl
    const FinancialRes = await fetch(`https://mindicador.cl/api`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!FinancialRes.ok) throw new Error(`API Miindicador falló: HTTP ${FinancialRes.status}`);
    const financialJson = await FinancialRes.json();

    // Datos de Coingecko
    const CriptoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=clp`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!CriptoRes.ok) throw new Error(`API Coingecko falló: HTTP ${CriptoRes.status}`);
    const CriptoJson = await CriptoRes.json();

    // Traer último registro
    const { data: lastRecord } = await supabase
      .from("financial_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Comprobar si cambió algún valor
    const currentData = {
      dolar: Number(financialJson.dolar?.valor) || 0,
      utm: Number(financialJson.utm?.valor) || 0,
      btc: Number(CriptoJson.bitcoin?.clp) || 0,
      eth: Number(CriptoJson.ethereum?.clp) || 0,
    };

    const hasChanged =
      !lastRecord ||
      lastRecord.dolar !== currentData.dolar ||
      lastRecord.utm !== currentData.utm ||
      lastRecord.btc !== currentData.btc ||
      lastRecord.eth !== currentData.eth;

    if (hasChanged) {
      const { data, error } = await supabase.from("financial_history").insert([currentData]);
      if (error) console.error("Error insertando en financial_history:", error);
      else console.log("Registro guardado correctamente:", data);
    }

    // Traer últimos 20 registros para histórico
    const { data: financialHistory } = await supabase
      .from("financial_history")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(20);

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
