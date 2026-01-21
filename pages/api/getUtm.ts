import { Financial } from "@/types/";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Financial>,
) {
  const financial = await getFinancial();
  res.status(200).json(financial);
}

export async function getFinancial(): Promise<Financial> {
  try {
    const FinancialRes = await fetch(`https://mindicador.cl/api`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!FinancialRes.ok) {
      throw new Error(`API Miindicador falló: HTTP ${FinancialRes.status}`);
    }
    const financialJson = await FinancialRes.json();
    const currentData = { utm: Number(financialJson.utm?.valor) || 0 };

    return {
      current: currentData,
    };
  } catch (error) {
    console.error("Error fetching finanzas:", error);
    return {
      current: { utm: 0 },
    };
  }
}
