import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { ReactNode } from "react";
import { z } from "zod";
import {
  financeHistoryItemSchema,
  financeHistorySchema,
  financeResumeSchema,
  movementDomainSchema,
  personalFinanceMovementSchema,
} from "./components/PersonalFinance/movementSchema";

export interface FinancialHistory {
  id?: string;
  created_at?: string;
  dolar: number;
  utm: number;
  btc: number;
  eth: number;
}

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

export interface Indicator {
  label: string;
  value: number;
  key: "dolar" | "utm" | "btc" | "eth";
}

export type Trend = "up" | "down" | "flat" | null;

export interface FinancialIndicatorProps {
  label: string;
  value: number;
  trend: Trend;
  id: string;
}

export interface FinancialHistoryPoint {
  created_at: string;
  dolar: number;
  utm: number;
  btc: number;
  eth: number;
}

export type OrderedFinancialHistory = FinancialHistoryPoint[];

export interface NewsSource {
  name: string;
  url: string;
}
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: NewsSource;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface News extends NewsResponse {
  _fallback?: boolean;
}

export interface Task {
  id: string;
  title: string;
  in_dev?: boolean;
  order: number;
  date?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface SkeletonProps {
  rows?: number;
  height?: number;
  className?: string;
}

export interface ToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export type ToastConfig = {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export interface TaskItemProps {
  task: Task;
  index: number;
  onTaskToggle: (taskId: string) => void;
  onTaskUpdate: (taskId: string, newTitle: string) => void;
  onTaskRequestRemove: (taskId: string) => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface WheaterResponse {
  temperatura: string;
}

export interface ClimaData {
  temperatura: string;
  _fallback?: boolean;
}

export interface AutoTextareaProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

export interface ActionButtonsProps {
  loading: boolean;
  onAdd: () => void;
  onCopy: () => void;
}

export interface ParsedData {
  title: string;
  objective: string;
  instructions: string;
  context: string;
  examples: string[];
  expected_output: string;
}

export interface ParsedDataViewProps {
  data: ParsedData;
  onEnviar: () => void;
}

export interface PromptData {
  title: string;
  objective: string;
  instructions: string;
  context: string;
  examples: string[];
  expected_output: string;
}

export interface TaskInputProps {
  title: string;
  setTitle: (v: string) => void;
  date?: string;
  setDate: (date: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.Ref<HTMLInputElement>;
  editingTaskId: string;
  handleAdd: () => void;
  handleSave: () => void;
}

export type TrendKey = "dolar" | "utm" | "btc" | "eth";
export type TrendResult = "up" | "down" | "flat";

export interface TaskActionButtonProps {
  icon: React.ReactNode;
  tooltipType?: "default" | "success" | "danger";
  tooltipText: string;
  onClick?: () => void;
  inDev?: boolean;
  dragging?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export type Feed = "gnews" | "biobio" | "latercera";

export type MovementTypes = "gastos" | "ahorros" | "ingresos";

export type IngresosCategory = "sueldo" | "otros";
export type GastosCategory =
  | "arriendo"
  | "gastos_comunes"
  | "luz"
  | "agua"
  | "fa"
  | "celular"
  | "internet"
  | "apv"
  | "fintual"
  | "comisiones"
  | "fondo_mutuo"
  | "bip"
  | "mercado_pago";
export type AhorrosCategory =
  | "fintual"
  | "fintual_dolares"
  | "fondo_mutuo"
  | "us_home"
  | "dorada_be"
  | "cripto_bitcoin"
  | "cripto_eth"
  | "nvidia";

export type PersonalFinance =
  | {
      id: string;
      type: "ingresos";
      date: string;
      value: number;
      category: IngresosCategory;
    }
  | {
      id: string;
      type: "gastos";
      date: string;
      value: number;
      category: GastosCategory;
    }
  | {
      id: string;
      type: "ahorros";
      date: string;
      value: number;
      category: AhorrosCategory;
    };

export type FinanceHistoryItem = z.infer<typeof financeHistoryItemSchema>;

export type FinanceHistory = z.infer<typeof financeHistorySchema>;

export type FinanceResume = z.infer<typeof financeResumeSchema>;
export interface FinanceHistoryProps {
  data: FinanceHistoryItem[];
}

export type PersonalFinanceMovement = z.infer<
  typeof personalFinanceMovementSchema
>;

export type MonthlyAccumulator = {
  ingresos: number;
  gastos: number;
  ahorros: number;
};

export type Movement = z.infer<typeof movementDomainSchema>;

export type ResumeType = "ingresos" | "gastos" | "ahorros";

export type Summary = {
  ingresos: number;
  gastos: number;
  ahorros: number;
  saldo: number;
};

export type PersonalFinanceContextType = {
  movements: PersonalFinance[];
  summary: Summary;
  loading: boolean;
  getMovements: () => Promise<void>;
  addMovement: (m: PersonalFinance) => Promise<void>;
  updateMovement: (updated: PersonalFinanceMovement) => Promise<void>;
  deleteMovement: (id: string) => void;
};
export interface Routine {
  id: number;
  start_time: string; // Formato HH:mm:ss
  end_time: string; // Formato HH:mm:ss
  label: string;
  icon: string;
  done_count: number;
  done: boolean;
  last_updated: string;
}
