import { WheaterData } from "@/types/";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WheaterData>,
) {
  const clima = await getWeather();
  res.status(200).json(clima);
}

export async function getWeather(): Promise<WheaterData> {
  const lat = -33.4489;
  const lon = -70.6693;

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Santiago`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) {
      throw new Error(`API Open-Meteo falló: HTTP ${res.status}`);
    }

    const data = await res.json();

    const actualTemp = data.current_weather.temperature;
    return {
      temperature: `${actualTemp}°C`,
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/weather", method: "GET" },
    });
    return {
      temperature: "0°C",
      _fallback: true,
    };
  }
}
