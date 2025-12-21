// contexts/PersonalFinanceContext.tsx
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AhorrosCategory,
  GastosCategory,
  IngresosCategory,
  PersonalFinance,
  PersonalFinanceMovement,
} from "@/types";
import { useUser } from "./UserContext";

type PersonalFinanceContextType = {
  movements: PersonalFinance[];
  loading: boolean;
  getMovements: () => Promise<void>;
  addMovement: (m: PersonalFinance) => Promise<void>;
  updateMovement: (updated: PersonalFinanceMovement) => Promise<void>;
  deleteMovement: (id: string) => void;
};

export const PersonalFinanceContext =
  createContext<PersonalFinanceContextType | null>(null);

interface PersonalFinanceProps {
  children: ReactNode;
}

export const PersonalFinanceProvider: React.FC<PersonalFinanceProps> = ({
  children,
}) => {
  const [movements, setMovements] = useState<PersonalFinance[]>([]);
  const [loading, setLoading] = useState(false);

  const { userId } = useUser();

  const getMovements = useCallback(async (): Promise<void> => {
    if (userId === null) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/personalFinances?authData=${userId}`);
      const dataFromApi = await response.json();
      const financials: PersonalFinance[] = dataFromApi.map((item: any) => {
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
      });
      setMovements(financials);
    } catch (error) {
      console.error("Error al obtener las finanzas personales");
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addMovement = async (newMovement: PersonalFinance): Promise<void> => {
    if (userId === null) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/personalFinances?authData=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newMovement }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al agregar personal Ficance");
      }
      const data = await response.json();
      const financial: PersonalFinance = data[0];
      setMovements((prev) => [...prev, financial]);
      return data;
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
    try {
      const response = await fetch(`/api/personalFinances?authData=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedMovement }),
      });
      const updatedArray = await response.json();
      const updated = updatedArray[0];
      setMovements((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      return updated;
    } catch (error) {
      console.error("Error al editar personal financial:", error);
      throw error;
    }
  };

  const deleteMovement = async (id: string) => {
    setMovements((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/personalFinances?id=${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error al eliminar fiancial personal:", error);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      getMovements();
    }
  }, [userId, getMovements]);

  return (
    <PersonalFinanceContext.Provider
      value={{
        movements,
        loading,
        getMovements,
        addMovement,
        updateMovement,
        deleteMovement,
      }}
    >
      {children}
    </PersonalFinanceContext.Provider>
  );
};
