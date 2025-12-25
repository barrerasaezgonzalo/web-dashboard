import { LucideIcon } from "lucide-react";
import { financeHistorySchema } from "./components/PersonalFinance/movementSchema";
import {
  AhorrosCategoryLabels,
  GastosCategoryLabels,
  IngresosCategoryLabels,
} from "./constants";
import {
  FinanceHistoryItem,
  Financial,
  FinancialHistory,
  Indicator,
  MonthlyAccumulator,
  OrderedFinancialHistory,
  ParsedData,
  PersonalFinance,
  PersonalFinanceMovement,
  PromptData,
  Task,
  Trend,
  TrendKey,
} from "./types";
import * as Icons from "lucide-react";

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

export function parsePromptResponse(raw: string): ParsedData {
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

export function getTrend(
  history: OrderedFinancialHistory,
  key: TrendKey,
): Trend {
  if (!history || history.length < 2) return null;

  const n = history.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const y = history[i][key];
    const x = i;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  const THRESHOLD = 0.01;

  if (slope > THRESHOLD) return "up";
  if (slope < -THRESHOLD) return "down";
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

  return diffInDays;
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("es-CL", {
    month: "short",
    year: "numeric",
  });
  let formatted = formatter.format(date); // ej: "nov. 2025"
  formatted = formatted.replace(".", ""); // "nov 2025"
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1); // "Nov 2025"

  return formatted;
}

export function formatMonthYearFromYMD(year: number, month: number): string {
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${monthNames[month - 1]} ${year}`;
}

export const generateMonthOptions = () => {
  const options = [];
  const start = new Date(2025, 10);
  const today = new Date();
  let current = start;

  while (current <= today) {
    const month = current.getMonth() + 1;
    const year = current.getFullYear();
    const value = `${String(month).padStart(2, "0")}-${year}`;

    options.push(
      <option key={value} value={value}>
        {formatMonthYearFromYMD(year, month)}
      </option>,
    );

    current.setMonth(current.getMonth() + 1);
  }

  return options;
};

export const getCategoryLabels = (type: "ingresos" | "gastos" | "ahorros") => {
  switch (type) {
    case "ingresos":
      return IngresosCategoryLabels;
    case "gastos":
      return GastosCategoryLabels;
    case "ahorros":
      return AhorrosCategoryLabels;
  }
};

export const getCategoryLabel = (
  type: "ingresos" | "gastos" | "ahorros",
  category: string,
) => {
  switch (type) {
    case "ingresos":
      return IngresosCategoryLabels[category as string] || category;
    case "gastos":
      return GastosCategoryLabels[category as string] || category;
    case "ahorros":
      return AhorrosCategoryLabels[category as string] || category;
    default:
      return category;
  }
};

export const calculateMonthlyResume = (
  movements: PersonalFinance[] | undefined,
  targetMonth: string, // formato "MM-YYYY"
) => {
  const safeMovements = movements ?? [];

  const ingresos = safeMovements
    .filter((m) => m.type === "ingresos" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const gastos = safeMovements
    .filter((m) => m.type === "gastos" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const ahorros = safeMovements
    .filter((m) => m.type === "ahorros" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const saldo = ingresos - gastos;

  return { ingresos, gastos, ahorros, saldo };
};

const isSameMonth = (dateStr: string, targetMonth: string) => {
  const [year, month] = dateStr.split("-");
  return `${month}-${year}` === targetMonth;
};

export function calculateFinanceHistory(movements: PersonalFinanceMovement[]) {
  const byMonth: Record<string, MonthlyAccumulator> = {};

  for (const m of movements) {
    const [year, month] = m.date.split("-");
    const key = `${month}-${year}`; // MM-YYYY

    if (!byMonth[key]) {
      byMonth[key] = {
        ingresos: 0,
        gastos: 0,
        ahorros: 0,
      };
    }

    byMonth[key][m.type] += m.value;
  }

  const history = Object.entries(byMonth)
    .sort(([a], [b]) => {
      const [ma, ya] = a.split("-").map(Number);
      const [mb, yb] = b.split("-").map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    })
    .map(([date, values]) => {
      const saldo = values.ingresos - values.gastos;

      return {
        date,
        ingresos: values.ingresos,
        gastos: values.gastos,
        ahorros: values.ahorros,
        saldo,
      };
    });

  return financeHistorySchema.parse(history);
}

export const getLastMonths = (count = 6): string[] => {
  const months: string[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    months.push(`${month}-${year}`);
  }

  return months;
};

export function buildFinanceHistory(
  movements: PersonalFinance[],
): FinanceHistoryItem[] {
  const months = getLastMonths(6); // tu función que da ["12-2025", "11-2025", ...]
  return months.map((month) => {
    const resume = calculateMonthlyResume(movements, month);
    return {
      date: month,
      ...resume, // ingresos, gastos, ahorros, saldo
    };
  });
}

export const getUnpaidExpensesForCurrentMonth = (
  movements: PersonalFinance[],
) => {
  const now = new Date();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = now.getFullYear().toString();

  const result = Object.keys(GastosCategoryLabels).map((category) => {
    const mov = movements.find((item) => {
      const [year, month, day] = item.date.split("-");

      return (
        item.type === "gastos" &&
        item.category === category &&
        month === currentMonth &&
        year === currentYear
      );
    });

    return {
      category,
      label: GastosCategoryLabels[category],
      value: mov ? mov.value : 0,
      isPaid: !!(mov?.value && mov.value > 0),
    };
  });

  return result.filter((item) => !item.isPaid);
};

export const getCurrentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${month}-${year}`;
};

export const getSpecialValue = (
  type: string,
  category: string,
  financial: any,
  defaultValue: number,
  rules: Record<string, (financial: any) => number>,
) => {
  const key = `${type}-${category}`;
  if (rules[key]) {
    return rules[key](financial);
  }
  return defaultValue;
};

const ICON_SANITIZE_REGEX = /[<>]/g;
const iconMap = Icons as unknown as Record<string, LucideIcon>;

export const getIcon = (name?: string): LucideIcon => {
  if (!name) return Icons.Activity;
  const key = name.replace(ICON_SANITIZE_REGEX, "");
  return iconMap[key] ?? Icons.Activity;
};

export const canAccessBrowserStorage = (win: unknown): boolean => {
  return typeof win !== "undefined";
};

export const getBrowserWindow = () => {
  return typeof window !== "undefined" ? window : undefined;
};
