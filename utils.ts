import { Financial, FinancialHistory, Indicator, PromptData, Task } from "./types";

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
    { label: "Dólar", value: `$${financial.current.dolar}`, key: "dolar" },
    { label: "UTM", value: formatCLP(financial.current.utm), key: "utm" },
    { label: "BTC", value: formatCLP(financial.current.btc), key: "btc" },
    { label: "ETH", value: formatCLP(financial.current.eth), key: "eth" },
  ];
};

export function mapSparklineData(history: FinancialHistory[]) {
  return history.map(f => ({
    date: f.created_at,
    dolar: f.dolar,
    utm: f.utm,
    btc: f.btc,
    eth: f.eth,
  }));
}

export type TrendKey = "dolar" | "utm" | "btc" | "eth";

export function getTrend(history: FinancialHistory[], key: TrendKey): "up" | "down" | "same" | null {
  if (history.length < 2) return null;

  const lastHistory = history[history.length - 1];
  const prevHistory = history[history.length - 2];

  if (lastHistory[key] > prevHistory[key]) return "up";
  if (lastHistory[key] < prevHistory[key]) return "down";
  return "same";
}

export function handleTextChange(
  event: React.ChangeEvent<HTMLTextAreaElement>,
  setNote: (v: string) => void,
  saveNote: (v: string) => void
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
  Ejemplos: ${data.examples.map(e => e.trim()).join(", ")}
  Resultado esperado: ${data.expected_output.trim()}`;
}