"use client";

import { Financial } from "@/types";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface FinancialContextType {
  financial: Financial;
  financialLoading: boolean;
  getFinancial: () => Promise<void>;
}

export const FinancialContext = createContext<FinancialContextType | undefined>(
  undefined,
);

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({
  children,
}) => {
  const [financial, setFinancial] = useState<Financial>({
    current: { dolar: 0, utm: 0, btc: 0, eth: 0 },
    history: [],
  });
  const [financialLoading, setFinancialLoading] = useState(false);

  const getFinancial = async () => {
    setFinancialLoading(true);
    try {
      const response = await fetch("/api/financial");
      const data: Financial = await response.json();
      setFinancial(data);
    } catch (error) {
      console.error("Error al obtener finanzas:", error);
      setFinancial({
        current: { dolar: 0, utm: 0, btc: 0, eth: 0 },
        history: [],
        _fallback: true,
      });
    } finally {
      setFinancialLoading(false);
    }
  };

  useEffect(() => {
    getFinancial();
  }, []);

  return (
    <FinancialContext.Provider
      value={{
        financial,
        financialLoading,
        getFinancial,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};
