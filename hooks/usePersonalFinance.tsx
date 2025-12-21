import { useState } from "react";
import { PersonalFinanceMovement } from "@/types";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useContext } from "react";

export function usePersonalFinance() {
  // const [movements, setMovements] = useState<PersonalFinanceMovement[]>([]);

  // const addMovement = (movement: PersonalFinanceMovement) => {
  //   setMovements((prev) => [...prev, movement]);
  // };

  // const updateMovement = (updated: PersonalFinanceMovement) => {
  //   setMovements((prev) =>
  //     prev.map((m) => (m.id === updated.id ? updated : m))
  //   );
  // };

  // const deleteMovement = (id: string) => {
  //   setMovements((prev) => prev.filter((m) => m.id !== id));
  // };
  const context = useContext(PersonalFinanceContext);
  if (!context) {
    throw new Error(
      "usePersonalFinance debe ser usado dentro de un PersonalFinance Provider",
    );
  }

  return context;
}
