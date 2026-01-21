import { CategoryOption, Financial } from "./types/";

export const IngresosCategoryLabels: CategoryOption[] = [
  { id: "sueldo", label: "Sueldo", fixed: false },
  { id: "otros", label: "Otros", fixed: false },
];

export const GastosCategoryLabels: CategoryOption[] = [
  { id: "arriendo", label: "Arriendo", fixed: true },
  { id: "gastos_comunes", label: "Gastos Comunes", fixed: true },
  { id: "luz", label: "Luz", fixed: true },
  { id: "agua", label: "Agua", fixed: true },
  { id: "fa", label: "FA", fixed: true },
  { id: "celular", label: "Celular", fixed: true },
  { id: "internet", label: "Internet", fixed: true },
  { id: "apv", label: "APV", fixed: true },
  { id: "fintual", label: "Fintual", fixed: true },
  { id: "comisiones", label: "Comisiones", fixed: false },
  { id: "fondo_mutuo", label: "Fondo Mutuo", fixed: true },
  { id: "bip", label: "Bip", fixed: false },
  { id: "mercado_pago", label: "Mercado Pago", fixed: false },
  { id: "btc", label: "BitCoin", fixed: false },
  { id: "eth", label: "Ethereum", fixed: false },
  { id: "ahorro", label: "Ahorro", fixed: false },
  { id: "otros", label: "Otros", fixed: false },
];

export const AhorrosCategoryLabels: CategoryOption[] = [
  { id: "fintual", label: "Fintual", fixed: false },
  { id: "fintual_dolares", label: "Fintual USD", fixed: false },
  { id: "fondo_mutuo", label: "Fondo Mutuo", fixed: false },
  { id: "us_home", label: "Home USD", fixed: false },
  { id: "dorada_be", label: "Dorada BE", fixed: false },
  { id: "cripto_bitcoin", label: "Bitcoin", fixed: false },
  { id: "cripto_eth", label: "Ethereum", fixed: false },
  { id: "nvidia", label: "Nvidia USD", fixed: false },
];

export const typeLabels: Record<string, string> = {
  bills: "Gastos",
  income: "Ingresos",
  saving: "Ahorros",
};

export const modalTitles = {
  income: "Agregar Ingreso",
  bills: "Agregar Gasto",
  saving: "Agregar Ahorro",
};

export const specialCategoryRules: Record<
  string,
  (financial: Financial) => number
> = {
  "bills-fa": (financial) => financial.current.utm * 8.1,
  "bills-celular": () => 16280,
  "bills-internet": () => 18990,
  "bills-apv": () => 150000,
  "bills-fintual": () => 150000,
  "bills-fondo_mutuo": () => 100000,
  "bills-comisiones": () => 300,
  "bills-btc": () => 50000,
  "bills-eth": () => 50000,
};

export const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const movementListSize = 5;

export const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
export const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
