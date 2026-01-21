import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { authFetch } from "@/hooks/authFetch";

import type {
  Financial,
  AhorrosCategory,
  GastosCategory,
  IngresosCategory,
  PersonalFinance,
  PersonalFinanceContextType,
  PersonalFinanceMovement,
} from "@/types/";
import { useAuth } from "./AuthContext";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { trackError } from "@/utils/logger";

export const PersonalFinanceContext =
  createContext<PersonalFinanceContextType | null>(null);

interface PersonalFinanceProps {
  children: ReactNode;
}

export const PersonalFinanceProvider: React.FC<PersonalFinanceProps> = ({
  children,
}) => {
  const { isPrivate } = usePrivacyMode();
  const [movements, setMovements] = useState<PersonalFinance[]>([]);
  const [summary] = useState({
    income: 0,
    bills: 0,
    saving: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [financial, setFinancial] = useState<Financial>({
    current: { utm: 0 },
  });

  const getFinancial = useCallback(async () => {
    const CACHE_KEY = "cache_utm_data";
    const now = new Date();
    const currentMonthYear = `${now.getMonth()}-${now.getFullYear()}`;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, monthYear } = JSON.parse(cached);
      if (monthYear === currentMonthYear && data.current.utm > 0) {
        setFinancial(data);
        return;
      }
    }
    try {
      const response = await authFetch("/api/getUtm");
      if (!response.ok) throw new Error("GetFinancial: api Error");

      const data: Financial = await response.json();

      if (data.current.utm > 0) {
        setFinancial({ current: { utm: data.current.utm } });

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: data,
            monthYear: currentMonthYear,
          }),
        );
      }
    } catch (error) {
      trackError(error, "GetFinancial");
    }
  }, [authFetch, trackError]);

  useEffect(() => {
    getFinancial();
  }, [getFinancial]);

  const getMovements = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await authFetch(`/api/personalFinances`);
      if (!response.ok) throw new Error("getMovements: api Error");
      const dataFromApi = await response.json();
      const financials: PersonalFinance[] = dataFromApi.map(
        (item: PersonalFinance) => {
          switch (item.type) {
            case "income":
              return { ...item, category: item.category as IngresosCategory };
            case "bills":
              return { ...item, category: item.category as GastosCategory };
            case "saving":
              return { ...item, category: item.category as AhorrosCategory };
            default:
              throw new Error("Tipo inválido de movimiento");
          }
        },
      );
      setMovements(financials);
    } catch (error) {
      trackError(error, "getMovements");
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addMovement = async (newMovement: PersonalFinance): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await authFetch(`/api/personalFinances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newMovement }),
      });
      if (!response.ok) throw new Error("addMovement: api Error");
      const data = await response.json();
      const financial: PersonalFinance = data[0];
      setMovements((prev) => [financial, ...prev]);
    } catch (error) {
      trackError(error, "addMovement");
    } finally {
      setLoading(false);
    }
  };

  const updateMovement = async (
    updatedMovement: PersonalFinanceMovement,
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/personalFinances`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedMovement }),
      });
      if (!response.ok) throw new Error("updateMovement: api Error");
      const updatedArray = await response.json();
      const updated = updatedArray[0];
      setMovements((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
    } catch (error) {
      trackError(error, "updateMovement");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovement = async (id: string) => {
    setMovements((prev) => prev.filter((t) => t.id !== id));
    try {
      const response = await authFetch(`/api/personalFinances?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("deleteMovement: api Error");
    } catch (error) {
      trackError(error, "deleteMovement");
    }
  };

  useEffect(() => {
    if (userId) getMovements();
  }, [userId, getMovements]);

  return (
    <PersonalFinanceContext.Provider
      value={{
        movements,
        summary,
        loading,
        getMovements,
        addMovement,
        updateMovement,
        deleteMovement,
        financial,
        isPrivate,
      }}
    >
      {children}
    </PersonalFinanceContext.Provider>
  );
};
