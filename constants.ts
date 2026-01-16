import { CategoryOption } from "./types/";

export const IngresosCategoryLabels: CategoryOption[] = [
  { id: "sueldo", label: "Sueldo", fijo: false },
  { id: "otros", label: "Otros", fijo: false },
];

export const GastosCategoryLabels: CategoryOption[] = [
  { id: "arriendo", label: "Arriendo", fijo: true },
  { id: "gastos_comunes", label: "Gastos Comunes", fijo: true },
  { id: "luz", label: "Luz", fijo: true },
  { id: "agua", label: "Agua", fijo: true },
  { id: "fa", label: "FA (UTM)", fijo: true },
  { id: "celular", label: "Celular", fijo: true },
  { id: "internet", label: "Internet", fijo: true },
  { id: "apv", label: "APV", fijo: true },
  { id: "fintual", label: "Fintual", fijo: true },
  { id: "comisiones", label: "Comisiones", fijo: false },
  { id: "fondo_mutuo", label: "Fondo Mutuo", fijo: true },
  { id: "bip", label: "Bip", fijo: false },
  { id: "mercado_pago", label: "Mercado Pago", fijo: false },
  { id: "btc", label: "BitCoin", fijo: false },
  { id: "eth", label: "Ethereum", fijo: false },
  { id: "ahorro", label: "Ahorro", fijo: false },
  { id: "otros", label: "Otros", fijo: false },
];

export const AhorrosCategoryLabels: CategoryOption[] = [
  { id: "fintual", label: "Fintual", fijo: false },
  { id: "fintual_dolares", label: "Fintual USD", fijo: false },
  { id: "fondo_mutuo", label: "Fondo Mutuo", fijo: false },
  { id: "us_home", label: "Home USD", fijo: false },
  { id: "dorada_be", label: "Dorada BE", fijo: false },
  { id: "cripto_bitcoin", label: "Bitcoin", fijo: false },
  { id: "cripto_eth", label: "Ethereum", fijo: false },
  { id: "nvidia", label: "Nvidia USD", fijo: false },
];

export const typeLabels: Record<string, string> = {
  gastos: "Gastos",
  ingresos: "Ingresos",
  ahorros: "Ahorros",
};

export const modalTitles = {
  ingresos: "Agregar Ingreso",
  gastos: "Agregar Gasto",
  ahorros: "Agregar Ahorro",
};

export const specialCategoryRules: Record<string, (financial: any) => number> =
  {
    "gastos-fa": (financial) => financial.current.utm * 8.1,
    "gastos-celular": () => 16280,
    "gastos-internet": () => 18990,
    "gastos-apv": () => 150000,
    "gastos-fintual": () => 150000,
    "gastos-fondo_mutuo": () => 100000,
    "gastos-comisiones": () => 300,
    "gastos-btc": () => 50000,
    "gastos-eth": () => 50000,
  };

export const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const movementListSize = 5;

export const horas = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
export const minutos = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
