import { ReactNode } from "react";

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
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
  onConfirm?: () => void;
  onCancel?: () => void;
};
