"use client";

import {
  Financial,
  FinancialContextType,
  FinancialProviderProps,
} from "@/types";
import { canAccessBrowserStorage, getBrowserWindow } from "@/utils";
import React, { createContext, useState, useEffect } from "react";

export const FinancialContext = createContext<FinancialContextType | undefined>(
  undefined,
);

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

      const dataIsEmpty =
        data.current.dolar === 0 &&
        data.current.utm === 0 &&
        data.current.btc === 0 &&
        data.current.eth === 0;

      if (dataIsEmpty || data._fallback) {
        if (!canAccessBrowserStorage(getBrowserWindow())) return null;

        const cachedData = localStorage.getItem("financialCache");
        if (cachedData) {
          const parsed: Financial = JSON.parse(cachedData);
          setFinancial({
            ...parsed,
            _fallback: true,
          });
          return;
        }
      }

      const newCurrent = {
        dolar: data.current.dolar || financial.current.dolar,
        utm: data.current.utm || financial.current.utm,
        btc: data.current.btc || financial.current.btc,
        eth: data.current.eth || financial.current.eth,
      };
      const newFinancial: Financial = {
        current: newCurrent,
        history: data.history.length > 0 ? data.history : financial.history,
      };

      if (!canAccessBrowserStorage(getBrowserWindow())) return null;
      localStorage.setItem("financialCache", JSON.stringify(newFinancial));
      setFinancial(newFinancial);
    } catch (error) {
      if (!canAccessBrowserStorage(getBrowserWindow())) return null;
      const cachedData = localStorage.getItem("financialCache");
      if (cachedData) {
        const parsed: Financial = JSON.parse(cachedData);
        setFinancial({
          ...parsed,
          _fallback: true,
        });
      } else {
        setFinancial((prev) => ({
          ...prev,
          _fallback: true,
        }));
      }
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
