import { Financial } from "@/types/";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";

let cachedFinancial: Financial | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Financial>,
) {
  const financial = await getFinancial();
  res.status(200).json(financial);
}

export async function getFinancial(): Promise<Financial> {
  const now = Date.now();

  if (cachedFinancial && now - lastFetchTime < CACHE_DURATION) {
    return cachedFinancial;
  }

  try {
    const FinancialRes = await fetch(`https://mindicador.cl/api`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!FinancialRes.ok) {
      throw new Error(`API Miindicador falló: HTTP ${FinancialRes.status}`);
    }

    const financialJson = await FinancialRes.json();
    const currentData = { utm: Number(financialJson.utm?.valor) || 0 };

    cachedFinancial = { current: currentData };
    lastFetchTime = now;

    return cachedFinancial;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/getUtm", method: "GET" },
    });

    if (cachedFinancial) {
      return cachedFinancial;
    }

    return {
      current: { utm: 0 },
    };
  }
}
