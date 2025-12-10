import { Task } from "./types";

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
