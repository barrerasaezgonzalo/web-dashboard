import { ReactNode } from "react";

export type FinanceHistoryItem = {
  date: string;
  ingresos: number;
  gastos: number;
  ahorros: number;
  saldo: number;
};

export interface Financial {
  current: {
    dolar: number;
    utm: number;
    btc: number;
    eth: number;
  };
  history: {
    id: string;
    created_at: string;
    dolar: number;
    utm: number;
    btc: number;
    eth: number;
  }[];
  _fallback?: boolean;
}

export interface FinancialHistory {
  id?: string;
  created_at?: string;
  dolar: number;
  utm: number;
  btc: number;
  eth: number;
}
export interface Indicator {
  label: string;
  value: number;
  key: "dolar" | "utm" | "btc" | "eth";
}

export interface FinancialHistoryPoint {
  created_at: string;
  dolar: number;
  utm: number;
  btc: number;
  eth: number;
}

export type OrderedFinancialHistory = FinancialHistoryPoint[];

export type Trend = "up" | "down" | "flat" | null;
export type TrendKey = "dolar" | "utm" | "btc" | "eth";

export interface FinancialIndicatorProps {
  label: string;
  value: number;
  trend: Trend;
  id: string;
}

export interface FinanceHistoryProps {
  data: FinanceHistoryItem[];
}

export interface FinancialContextType {
  financial: Financial;
  financialLoading: boolean;
  getFinancial: () => Promise<void | null>;
}

export interface FinancialProviderProps {
  children: ReactNode;
}

//export type FinanceHistory = FinanceHistoryItem[];
