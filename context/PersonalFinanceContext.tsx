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
    ingresos: 0,
    gastos: 0,
    ahorros: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [financial, setFinancial] = useState<Financial>({
    current: { utm: 0 },
  });

  const getFinancial = useCallback(async () => {
    try {
      const response = await authFetch("/api/getUtm");
      if (!response.ok) throw new Error("GetFinancial api Error");

      const data: Financial = await response.json();
      setFinancial((prevFinancial) => {
        const newCurrent = {
          utm: data.current.utm || prevFinancial.current.utm,
        };
        return { current: newCurrent };
      });
    } catch (error) {
      trackError(error, "GetFinancial");
    }
  }, []);

  useEffect(() => {
    getFinancial();
  }, [getFinancial]);

  const getMovements = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await authFetch(`/api/personalFinances`);
      const dataFromApi = await response.json();
      const financials: PersonalFinance[] = dataFromApi.map(
        (item: PersonalFinance) => {
          switch (item.type) {
            case "ingresos":
              return { ...item, category: item.category as IngresosCategory };
            case "gastos":
              return { ...item, category: item.category as GastosCategory };
            case "ahorros":
              return { ...item, category: item.category as AhorrosCategory };
            default:
              throw new Error("Tipo inválido de movimiento");
          }
        },
      );
      setMovements(financials);
    } catch (error) {
      console.error("Error al obtener las finanzas personales:", error);
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
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al agregar personal finance");
      }
      const data = await response.json();
      const financial: PersonalFinance = data[0];
      setMovements((prev) => [financial, ...prev]);
    } catch (error) {
      console.error("Error al agregar personal financial:", error);
      throw error;
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
      const updatedArray = await response.json();
      const updated = updatedArray[0];
      setMovements((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
    } catch (error) {
      console.error("Error al editar personal financial:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMovement = async (id: string) => {
    setMovements((prev) => prev.filter((t) => t.id !== id));
    try {
      await authFetch(`/api/personalFinances?id=${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error al eliminar personal financial:", error);
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
