import { Feed } from "./types";

export const IngresosCategoryLabels: Record<string, string> = {
  sueldo: "Sueldo",
  otros: "Otros",
};

export const GastosCategoryLabels: Record<string, string> = {
  arriendo: "Arriendo",
  gastos_comunes: "Gastos Comunes",
  luz: "Luz",
  agua: "Agua",
  fa: "FA (UTM)",
  celular: "Celular",
  internet: "Internet",
  apv: "APV",
  fintual: "Fintual",
  comisiones: "Comisiones",
  fondo_mutuo: "Fondo Mutuo",
  bip: "Bip",
  mercado_pago: "Mercado Pago",
};

export const AhorrosCategoryLabels: Record<string, string> = {
  fintual: "Fintual",
  fintual_dolares: "Fintual USD",
  fondo_mutuo: "Fondo Mutuo",
  us_home: "Home USD",
  dorada_be: "Dorada BE",
  cripto_bitcoin: "Bitcoin USD",
  cripto_eth: "Ethereum USD",
  nvidia: "Nvidia USD",
};

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

export const feeds: { label: string; value: Feed }[] = [
  { label: "BioBio", value: "biobio" },
  { label: "La Tercera", value: "latercera" },
  { label: "GNews", value: "gnews" },
];

export const specialCategoryRules: Record<string, (financial: any) => number> =
  {
    "gastos-fa": (financial) => financial.current.utm * 8.1,
    "gastos-celular": () => 16280,
    "gastos-internet": () => 18990,
    "gastos-apv": () => 150000,
    "gastos-fintual": () => 150000,
    "gastos-fondo_mutuo": () => 100000,
  };
