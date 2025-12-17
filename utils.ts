import {
  Financial,
  FinancialHistory,
  Indicator,
  OrderedFinancialHistory,
  PromptData,
  Task,
  Trend,
} from "./types";

export const formatCLP = (valor: number | string) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor.toString() as unknown as number);
};

export function abrirGpt(
  pregunta: string,
  setPregunta: (preguna: string) => void,
) {
  if (!pregunta.trim()) {
    return;
  }
  const url = ` https://chatgpt.com/?prompt=${encodeURIComponent(pregunta)}`;

  window.open(url, "_blank");
  setPregunta("");
}

export function abrirGoogle(
  pregunta: string,
  setPregunta: (preguna: string) => void,
) {
  if (!pregunta.trim()) {
    return;
  }
  const url = `https://www.google.com/search?q=${encodeURIComponent(pregunta)}`;
  window.open(url, "_blank");
  setPregunta("");
}

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export function parsePromptResponse(raw: string): any {
  let cleaned = raw
    .replace(/^\s*```+\s*/, "")
    .replace(/\s*```+\s*$/, "")
    .trim();

  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n");
  }

  const startIndex = cleaned.indexOf("{");
  const endIndex = cleaned.lastIndexOf("}");
  if (startIndex === -1 || endIndex === -1)
    throw new Error("JSON no encontrado");

  const jsonString = cleaned.slice(startIndex, endIndex + 1);

  return JSON.parse(jsonString);
}

export function reorderTasks(
  tasks: Task[],
  sourceIndex: number,
  destinationIndex: number,
): Task[] {
  const items = Array.from(tasks);
  const [movedItem] = items.splice(sourceIndex, 1);
  items.splice(destinationIndex, 0, movedItem);
  return items;
}

export function getIndicators(financial: Financial): Indicator[] {
  return [
    { label: "Dólar", value: financial.current.dolar, key: "dolar" },
    { label: "UTM", value: financial.current.utm, key: "utm" },
    { label: "BTC", value: financial.current.btc, key: "btc" },
    { label: "ETH", value: financial.current.eth, key: "eth" },
  ];
}

export function mapSparklineData(history: FinancialHistory[]) {
  return history.map((f) => ({
    date: f.created_at,
    dolar: f.dolar,
    utm: f.utm,
    btc: f.btc,
    eth: f.eth,
  }));
}

export type TrendKey = "dolar" | "utm" | "btc" | "eth";
export type TrendResult = "up" | "down" | "flat";

export function getTrend(
  history: OrderedFinancialHistory,
  key: TrendKey,
): Trend {
  if (!history || history.length < 2) return null;

  if (!history[0]?.created_at || !history[history.length - 1]?.created_at) {
    console.warn("getTrend: history sin created_at válido");
    return null;
  }

  const first = history[0][key];
  const last = history[history.length - 1][key];

  if (first === 0) return null;

  const variation = (last - first) / first;
  const THRESHOLD = 0.01; // 1%

  if (variation > THRESHOLD) return "up";
  if (variation < -THRESHOLD) return "down";

  return "flat";
}

export function getTrendUI(trend: Trend) {
  switch (trend) {
    case "up":
      return {
        color: "text-green-600",
        label: "Tendencia en alta",
      };
    case "down":
      return {
        color: "text-red-600",
        label: "Tendencia en baja",
      };
    case "flat":
      return {
        color: "text-gray-500",
        label: "Lateral",
      };
    default:
      return {
        color: "text-gray-400",
        label: "Sin datos",
      };
  }
}

export function handleTextChange(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  setNote: (v: string) => void,
  saveNote: (v: string) => void,
) {
  const value = event.target.value;
  setNote(value);
  saveNote(value);
}

export function formatFechaHora(date: Date) {
  const fecha = date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hora = date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return { fecha, hora };
}

export function formatPromptOutput(data: PromptData) {
  return `Título: ${data.title.trim()}
  Objetivo: ${data.objective.trim()}
  Instrucciones: ${data.instructions.trim()}
  Contexto: ${data.context.trim()}
  Ejemplos: ${data.examples.map((e) => e.trim()).join(", ")}
  Resultado esperado: ${data.expected_output.trim()}`;
}

export const roundToThousands = (number: number) => {
  if (typeof number !== "number" || !isFinite(number)) {
    return 0;
  }
  return Math.round(number / 1000) * 1000;
};

export function formatDateToDMY(date: string): string {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    throw new Error("Formato de fecha inválido. Se espera YYYY-MM-DD");
  }

  return `${day}/${month}/${year}`;
}

export function getDaysRemainingUntil(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Formato inválido. Se espera YYYY-MM-DD");
  }

  const [year, month, day] = date.split("-").map(Number);

  const targetDate = new Date(year, month - 1, day);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = targetDate.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInMs / 86400000);

  return Math.max(diffInDays, 0);
}
