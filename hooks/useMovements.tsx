// hooks/useMovements.ts
import { useState, useRef, useEffect, useContext } from "react";
import {
  PersonalFinance,
  MovementTypes,
  AhorrosCategory,
  GastosCategory,
  IngresosCategory,
} from "@/types";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { usePersonalFinance } from "@/hooks/usePersonalFinance";
import { useToast } from "@/hooks/useToast";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import { useFinancial } from "@/hooks/useFinancial";
import { getCategoryLabels } from "@/utils";

type Errors = {
  category?: string;
  value?: string;
};

export const useMovements = () => {
  const [modalType, setModalType] = useState<MovementTypes | null>(null);
  const [category, setCategory] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [editingItem, setEditingItem] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });
  const [selectedType, setSelectedType] =
    useState<PersonalFinance["type"]>("gastos");
  const inputRef = useRef<HTMLInputElement>(null);
  const { movements } = useContext(PersonalFinanceContext)!;
  const { addMovement, updateMovement, deleteMovement } = usePersonalFinance();
  const { toast, openToast, closeToast } = useToast();
  const { isPrivate } = usePrivacyMode();
  const { financial } = useFinancial();

  const savingsUsdCategoryRules: Record<
    string,
    (financial: any, usdValue: number) => number
  > = {
    fintual_dolares: (financial, usdValue) =>
      usdValue * (financial.current.dolar ?? 0),
    cripto_bitcoin: (financial, usdValue) =>
      usdValue * (financial.current.dolar ?? 0),
    cripto_eth: (financial, usdValue) =>
      usdValue * (financial.current.dolar ?? 0),
    us_home: (financial, usdValue) => usdValue * (financial.current.dolar ?? 0),
    nvidia: (financial, usdValue) => usdValue * (financial.current.dolar ?? 0),
  };

  const filtrados: PersonalFinance[] = movements.filter((item) => {
    const [year, month] = item.date.split("-");
    return item.type === selectedType && `${month}-${year}` === selectedMonth;
  });

  const total = filtrados.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    if (modalType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalType]);

  const validateForm = (): boolean => {
    const formattedErrors: Errors = {};

    if (!category || typeof category !== "string" || !category.trim()) {
      formattedErrors.value = "Selecciona una categoría válida";
    }

    const numericValue = Number(value);
    if (value === undefined || value === null || value === "") {
      formattedErrors.value = "Debes ingresar un valor";
    } else if (isNaN(numericValue) || numericValue <= 0) {
      formattedErrors.value = "El valor debe ser un número positivo";
    }

    setErrors(formattedErrors);
    return Object.keys(formattedErrors).length === 0;
  };

  const resetModal = () => {
    setModalType(null);
    setEditingItem("");
    setCategory("");
    setValue("");
    setErrors({});
  };

  const handleAddMovement = () => {
    if (!validateForm() || !modalType) return;

    let finalValue = Number(value);
    if (modalType === "ahorros" && savingsUsdCategoryRules[category]) {
      finalValue = savingsUsdCategoryRules[category](financial, Number(value));
    }

    let newMovement: PersonalFinance;
    switch (modalType) {
      case "ingresos":
        newMovement = {
          id: Date.now().toString(),
          type: "ingresos",
          category: category as IngresosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "gastos":
        newMovement = {
          id: Date.now().toString(),
          type: "gastos",
          category: category as GastosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "ahorros":
        newMovement = {
          id: Date.now().toString(),
          type: "ahorros",
          category: category as AhorrosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      default:
        return;
    }

    addMovement(newMovement);
    resetModal();
  };

  const handleUpdateMovement = () => {
    if (!validateForm() || !editingItem || !modalType) return;
    let finalValue = Number(value);
    if (modalType === "ahorros" && savingsUsdCategoryRules[category]) {
      finalValue = savingsUsdCategoryRules[category](financial, Number(value));
    }

    let updatedMovement: PersonalFinance;
    switch (modalType) {
      case "ingresos":
        updatedMovement = {
          id: editingItem,
          type: "ingresos",
          category: category as IngresosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "gastos":
        updatedMovement = {
          id: editingItem,
          type: "gastos",
          category: category as GastosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      case "ahorros":
        updatedMovement = {
          id: editingItem,
          type: "ahorros",
          category: category as AhorrosCategory,
          value: finalValue,
          date: new Date().toISOString().split("T")[0],
        };
        break;
      default:
        return;
    }

    updateMovement(updatedMovement);
    resetModal();
  };

  const handleDeleteMovement = (id: string) => {
    openToast({
      message: "¿Estás seguro que deseas eliminar el movimiento?",
      onConfirm: () => {
        deleteMovement(id);
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  const handleOpenAddModal = (initialCategory?: string) => {
    setModalType(selectedType);
    setEditingItem("");
    setValue("");
    if (initialCategory) {
      setCategory(initialCategory);
    } else {
      const firstCategory = Object.keys(getCategoryLabels(selectedType))[0];
      setCategory(firstCategory);
    }
    setErrors({});
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim())
      editingItem ? handleUpdateMovement() : handleAddMovement();
  };

  return {
    modalType,
    category,
    value,
    editingItem,
    errors,
    inputRef,
    filtrados,
    total,
    selectedType,
    selectedMonth,
    isPrivate,
    toast,
    setCategory,
    setValue,
    setSelectedType,
    setSelectedMonth,
    setModalType,
    setEditingItem,
    setErrors,
    handleOpenAddModal,
    handleAddMovement,
    handleUpdateMovement,
    handleDeleteMovement,
    handleInputKeyDown,
    resetModal,
    validateForm,
  };
};
