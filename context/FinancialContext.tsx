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

      // Mantener último valor si los datos vienen en cero
      const newCurrent = {
        dolar: data.current.dolar || financial.current.dolar,
        utm: data.current.utm || financial.current.utm,
        btc: data.current.btc || financial.current.btc,
        eth: data.current.eth || financial.current.eth,
      };

      setFinancial({
        current: newCurrent,
        history: data.history.length > 0 ? data.history : financial.history,
      });
    } catch (error) {
      console.error("Error al obtener finanzas:", error);
      // Mantener último valor como fallback
      setFinancial((prev) => ({
        ...prev,
        _fallback: true,
      }));
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
