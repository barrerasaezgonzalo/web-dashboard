import { ReactNode } from "react";

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
  value: string;
  key: keyof FinancialHistory;
}

export interface FinancialIndicatorProps {
  label: string;
  value: string;
  trend: "up" | "down" | "same" | null;
}

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
  onConfirm?: () => void;
  onCancel?: () => void;
}

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
  onAdd: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}