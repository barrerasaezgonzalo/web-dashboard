// contexts/PersonalFinanceContext.tsx
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
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
export const PersonalFinanceContext =
  createContext<PersonalFinanceContextType | null>(null);

interface PersonalFinanceProps {
  children: ReactNode;
}

export const PersonalFinanceProvider: React.FC<PersonalFinanceProps> = ({
  children,
}) => {
  const [movements, setMovements] = useState<PersonalFinance[]>([]);
  const [summary, setSummary] = useState({
    ingresos: 0,
    gastos: 0,
    ahorros: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [financial, setFinancial] = useState<any>({
    current: { utm: 0 },
  });

  const getFinancial = async () => {
    try {
      const response = await fetch("/api/getUtm");
      const data: Financial = await response.json();
      const newCurrent = { utm: data.current.utm || financial.current.utm };
      const newFinancial: Financial = { current: newCurrent };
      setFinancial(newFinancial);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFinancial();
  }, []);

  // Calcula el summary cada vez que movements cambia
  useEffect(() => {
    const ingresos = movements
      .filter((m) => m.type === "ingresos")
      .reduce((acc, m) => acc + m.value, 0);
    const gastos = movements
      .filter((m) => m.type === "gastos")
      .reduce((acc, m) => acc + m.value, 0);
    const ahorros = movements
      .filter((m) => m.type === "ahorros")
      .reduce((acc, m) => acc + m.value, 0);
    const saldo = ingresos - gastos;

    setSummary({ ingresos, gastos, ahorros, saldo });
  }, [movements]);

  const getMovements = useCallback(async (): Promise<void> => {
    if (!userId) return;
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
      const response = await fetch(`/api/personalFinances?authData=${userId}`, {
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
      setMovements((prev) => [...prev, financial]);
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
    } catch (error) {
      console.error("Error al editar personal financial:", error);
      throw error;
    }
  };

  const deleteMovement = async (id: string) => {
    setMovements((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/personalFinances?id=${id}&authData=${userId}`, {
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
      }}
    >
      {children}
    </PersonalFinanceContext.Provider>
  );
};
