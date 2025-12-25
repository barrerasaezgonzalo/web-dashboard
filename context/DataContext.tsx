"use client";

import React, { createContext, ReactNode } from "react";
import { useData } from "@/hooks/useData";

export const DataContext = createContext<
  ReturnType<typeof useData> | undefined
>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const data = useData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
