import type { NextApiRequest, NextApiResponse } from "next";

interface FinancialData {
  dolar: "0";
  utm: "0";
  btc: "0";
  eth: "0";
  _fallback?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FinancialData>,
) {
  const clima = await getFinancial();
  res.status(200).json(clima);
}

export async function getFinancial(): Promise<FinancialData> {
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
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!CriptoRes.ok) {
      throw new Error(`API Coingecko falló: HTTP ${CriptoRes.status}`);
    }
    const CriptoJson = await CriptoRes.json();
    return {
      dolar: financialJson.dolar?.valor || "0",
      utm: financialJson.utm?.valor || "0",
      btc: CriptoJson.bitcoin?.clp || "0",
      eth: CriptoJson.ethereum?.clp || "0",
    };
  } catch (error) {
    console.error("Error fetching finanzas:", error);
    return {
      dolar: "0",
      utm: "0",
      btc: "0",
      eth: "0",
      _fallback: true,
    };
  }
}
