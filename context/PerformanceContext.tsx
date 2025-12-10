"use client";

import { createContext, useState, ReactNode } from "react";

interface PerformanceContextProps {
  lcp: number | null;
  ttfb: number | null;
  fcp: number | null;
  cls: number | null;
  setLCP: (value: number) => void;
  setTTFB: (value: number) => void;
  setFCP: (value: number) => void;
  setCLS: (value: number) => void;
}

export const PerformanceContext = createContext<
  PerformanceContextProps | undefined
>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lcp, setLCP] = useState<number | null>(null);
  const [ttfb, setTTFB] = useState<number | null>(null);
  const [fcp, setFCP] = useState<number | null>(null);
  const [cls, setCLS] = useState<number | null>(null);

  return (
    <PerformanceContext.Provider
      value={{ lcp, ttfb, fcp, cls, setLCP, setTTFB, setFCP, setCLS }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};
