import {
  AhorrosCategoryLabels,
  GastosCategoryLabels,
  IngresosCategoryLabels,
} from "./constants";
import {
  CategoryOption,
  CategoryStat,
  Financial,
  MovementType,
  PersonalFinance,
  PersonalFinanceMovement,
  PointGraphic,
} from "./types/";

export const formatCLP = (value: number | string) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value.toString() as unknown as number);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export function formatFechaHora(now: Date) {
  const date = now.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = now.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return { date, hour };
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
  const current = new Date(start);

  while (current <= today) {
    const month = current.getMonth() + 1;
    const year = current.getFullYear();

    const value = `${year}-${String(month).padStart(2, "0")}`;

    options.push(
      <option key={value} value={value} className="bg-slate-900">
        {formatMonthYearFromYMD(year, month)}
      </option>,
    );

    current.setMonth(current.getMonth() + 1);
  }

  return options.reverse();
};

export const getCategoryLabels = (type: MovementType): CategoryOption[] => {
  switch (type) {
    case "income":
      return IngresosCategoryLabels;
    case "bills":
      return GastosCategoryLabels;
    case "saving":
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

  const income = safeMovements
    .filter((m) => m.type === "income" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const bills = safeMovements
    .filter((m) => m.type === "bills" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const saving = safeMovements
    .filter((m) => m.type === "saving" && isSameMonth(m.date, targetMonth))
    .reduce((acc, m) => acc + m.value, 0);

  const balance = income - bills;

  return { income, bills, saving, balance };
};

const isSameMonth = (dateStr: string, targetMonth: string) => {
  const [year, month] = dateStr.split("-");
  return `${month}-${year}` === targetMonth;
};

export const getPendingAndVariableExpenses = (movements: PersonalFinance[]) => {
  const now = new Date();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = now.getFullYear().toString();

  return GastosCategoryLabels.map((category) => {
    const categoryMovements = movements.filter((m) => {
      const [year, month] = m.date.split("-");
      return (
        m.type === "bills" &&
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
    return item.fixed === true && item.isPaid === false;
  });
};

export const getSpecialValue = (
  type: string,
  category: string,
  financial: Financial,
  defaultValue: number,
  rules: Record<string, (financial: Financial) => number>,
) => {
  const key = `${type}-${category}`;
  if (rules[key]) {
    return rules[key](financial);
  }
  return defaultValue;
};

export const stripHtml = (html: string) => {
  if (!html) return "";
  let clean = html.replace(/&nbsp;/g, " ");
  clean = clean.replace(/<\/div>|<br\s*\/?>|<\/p>/gi, " ");
  clean = clean.replace(/<[^>]*>?/gm, "");
  return clean.replace(/\s+/g, " ").trim();
};

export const getLast6MonthsKeys = () => {
  const keys = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${d.getMonth()}`);
  }
  return keys;
};

export const calculateCategoryStats = (
  graphList: PersonalFinanceMovement[],
): Record<string, CategoryStat> => {
  const data: Record<string, CategoryStat> = {};

  const last6MonthsKeys = getLast6MonthsKeys();
  graphList.forEach((m) => {
    if (m.type !== "bills") return;
    const statsKey = `${m.type}-${m.category}`;

    const d = new Date(m.date);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

    if (!last6MonthsKeys.includes(key)) return;

    if (!data[statsKey]) {
      data[statsKey] = {
        points: last6MonthsKeys.map((k) => ({ month: k, value: 0 })),
        variation: 0,
        hasComparison: false,
        pointsToGraph: [],
      };
    }

    const point = data[statsKey].points.find((p) => p.month === key);
    if (point) point.value += m.value;
  });

  Object.keys(data).forEach((sKey) => {
    const p = data[sKey].points;
    const current = p[5].value;
    const last = p[4].value;

    let variation = 0;
    let hasComparison = false;

    if (last > 0) {
      variation = ((current - last) / last) * 100;
      hasComparison = true;
    }

    data[sKey].variation = variation;
    data[sKey].hasComparison = hasComparison;

    const pointsWithData = p.filter((point) => point.value > 0);
    if (pointsWithData.length === 1) {
      data[sKey].pointsToGraph = [
        { ...pointsWithData[0], month: "prev" },
        pointsWithData[0],
      ];
    } else {
      data[sKey].pointsToGraph = p.filter(
        (point: PointGraphic, index: number) => {
          if (index >= 4) return true;
          return point.value > 0;
        },
      );
    }
  });

  return data;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("¡Copiado al portapapeles!");
  } catch (err) {
    console.error("Error al copiar: ", err);
  }
};
