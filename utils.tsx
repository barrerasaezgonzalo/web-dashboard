import {
  AhorrosCategoryLabels,
  GastosCategoryLabels,
  IngresosCategoryLabels,
} from "./constants";
import { CategoryOption, MovementType, PersonalFinance } from "./types/";

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

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

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

export const getCategoryLabels = (type: MovementType): CategoryOption[] => {
  switch (type) {
    case "ingresos":
      return IngresosCategoryLabels;
    case "gastos":
      return GastosCategoryLabels;
    case "ahorros":
      return AhorrosCategoryLabels;
    default:
      return [];
  }
};

export const getCategoryLabel = (
  type: MovementType,
  categoryId: string,
): string => {
  const categories = getCategoryLabels(type);
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.label : categoryId;
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

export const getPendingAndVariableExpenses = (
  movements: PersonalFinance[],
  showAll: boolean,
) => {
  const now = new Date();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = now.getFullYear().toString();

  return GastosCategoryLabels.map((category) => {
    const categoryMovements = movements.filter((m) => {
      const [year, month] = m.date.split("-");
      return (
        m.type === "gastos" &&
        m.category === category.id &&
        month === currentMonth &&
        year === currentYear
      );
    });

    const totalPaid = categoryMovements.reduce(
      (acc, current) => acc + current.value,
      0,
    );
    const isPaid = totalPaid > 0;

    return {
      ...category,
      totalPaid,
      isPaid,
    };
  }).filter((item) => {
    if (showAll) return true;
    return item.fijo === true && item.isPaid === false;
  });
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

export const canAccessBrowserStorage = (win: unknown): boolean => {
  return typeof win !== "undefined";
};

export const getBrowserWindow = () => {
  return typeof window !== "undefined" ? window : undefined;
};

export const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};
