import { useState, useMemo, useCallback, useContext } from "react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import {
  PersonalFinance,
  MovementType,
  PersonalFinanceMovement,
  MovementGroup,
} from "@/types";
import { useToast } from "@/hooks/useToast";
import * as XLSX from "xlsx";

export const useMovements = () => {
  const context = useContext(PersonalFinanceContext);
  if (!context) throw new Error("useMovements must be used within provider");

  const { openToast, closeToast } = useToast();
  const [modalType, setModalType] = useState<MovementType | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MovementType>("bills");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const filtered = useMemo(() => {
    return context.movements.filter((m) => {
      const matchesType = m.type === selectedType;
      const matchesMonth = m.date.startsWith(selectedMonth);
      return matchesType && matchesMonth;
    });
  }, [context.movements, selectedType, selectedMonth]);

  const total = useMemo(() => {
    return filtered.reduce((acc, curr) => acc + curr.value, 0);
  }, [filtered]);

  const groupedData = useMemo(() => {
    if (!context.movements) return {};

    const filteredNormalized = context.movements.filter((m) => {
      const normalizedDate = m.date.includes("/")
        ? m.date.split("/").reverse().join("-")
        : m.date;

      const matchesMonth = normalizedDate.startsWith(selectedMonth);
      const matchesType =
        m.type.toLowerCase().trim() === selectedType.toLowerCase().trim();

      return matchesMonth && matchesType;
    });

    return filteredNormalized.reduce(
      (acc: Record<string, MovementGroup>, mov) => {
        const key = `${mov.type}-${mov.category}`;

        if (!acc[key]) {
          acc[key] = {
            items: [],
            total: 0,
            type: mov.type,
            category: mov.category,
          };
        }

        acc[key].items.push(mov);
        acc[key].total += mov.value;

        return acc;
      },
      {},
    );
  }, [context.movements, selectedMonth, selectedType]);

  const resetModal = useCallback(() => {
    setModalType(null);
    setCategory("");
    setValue("");
    setDescription("");
    setEditingItem(null);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setModalType(selectedType);
  }, [selectedType]);

  const handleOpenPendingPayment = useCallback((categoryId: string) => {
    setModalType("bills");
    setCategory(categoryId);
    setValue("");
  }, []);

  const handleEditClick = useCallback((item: PersonalFinanceMovement) => {
    setEditingItem(item.id);
    setCategory(item.category);
    setDescription(item.description ?? "");
    setValue(item.value.toString());
    setModalType(item.type);
  }, []);

  const handleAddMovement = async () => {
    try {
      const day = new Date().getDate().toString().padStart(2, "0");
      const newMovement = {
        type: modalType,
        category,
        description,
        value: Number(value),
        date: `${selectedMonth}-${day}`,
      } as PersonalFinance;

      await context.addMovement(newMovement);
      resetModal();
      openToast({ message: "Movimiento agregado correctamente" });
    } catch {
      openToast({ message: "Error al agregar el movimiento" });
    }
  };

  const handleUpdateMovement = async () => {
    if (!editingItem) return;
    try {
      const updated = {
        id: editingItem,
        type: modalType,
        category,
        description,
        value: Number(value),
        date: filtered.find((f) => f.id === editingItem)?.date,
      } as PersonalFinance;

      await context.updateMovement(updated);
      resetModal();
      openToast({ message: "Movimiento actualizado" });
    } catch {
      openToast({ message: "Error al actualizar" });
    }
  };

  const handleDeleteMovement = (id: string) => {
    openToast({
      message: "¿Eliminar este movimiento?",
      onConfirm: () => {
        context.deleteMovement(id);
        closeToast();
      },
      onCancel: closeToast,
    });
  };

  const checkGoldenInvestment = useMemo(() => {
    const BASE_VALUE = 2800000;
    const FACTOR = 6;
    const minimalGolden = BASE_VALUE * FACTOR;

    const totalGoldenSavings = context.movements
      .filter((m) => m.type === "saving" && m.category === "dorada_be")
      .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

    const canInvest = totalGoldenSavings >= minimalGolden;
    const lack = minimalGolden - totalGoldenSavings;

    return {
      canInvest,
      totalDorada: totalGoldenSavings,
      missingGolden: lack > 0 ? lack : 0,
      minimalGolden,
    };
  }, [context.movements]);

  const summary = useMemo(() => {
    const movementsOfMonth = context.movements.filter((m) =>
      m.date.startsWith(selectedMonth),
    );

    const income = movementsOfMonth
      .filter((m) => m.type === "income")
      .reduce((acc, m) => acc + m.value, 0);

    const bills = movementsOfMonth
      .filter((m) => m.type === "bills")
      .reduce((acc, m) => acc + m.value, 0);

    const saving = context.movements
      .filter((m) => m.type === "saving")
      .reduce((acc, m) => acc + m.value, 0);

    return {
      income,
      bills,
      saving: saving,
      balance: income - bills,
    };
  }, [context.movements, selectedMonth]);

  const exportToExcel = (
    data: PersonalFinanceMovement[],
    periodName: string,
  ) => {
    const rows = data.map((item) => {
      const [year, month, day] = item.date.split("-");
      const formatedDate = `${day}/${month}/${year}`;

      return {
        FECHA: formatedDate,
        TIPO: item.type.toUpperCase(),
        CATEGORÍA:
          item.category.charAt(0).toUpperCase() + item.category.slice(1),
        DESCRIPCIÓN: item.description || "-",
        MONTO: Number(item.value),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const columnWidths = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Tipo
      { wch: 15 }, // Categoría
      { wch: 30 }, // Descripción
      { wch: 12 }, // Monto
    ];
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzas");
    XLSX.writeFile(workbook, `Reporte_${periodName.replace(" ", "_")}.xlsx`);
  };

  const emptyFields = category.trim() === "" || value.trim() === "";
  const disableSubmit = emptyFields || context.loading;

  return {
    ...context,
    summary,
    modalType,
    category,
    description,
    value,
    editingItem,
    filtered,
    total,
    selectedType,
    selectedMonth,
    setCategory,
    setDescription,
    setValue,
    setSelectedType,
    setSelectedMonth,
    setEditingItem,
    setModalType,
    handleOpenAddModal,
    handleAddMovement,
    handleUpdateMovement,
    handleDeleteMovement,
    handleEditClick,
    resetModal,
    ...checkGoldenInvestment,
    handleOpenPendingPayment,
    graphList: context.movements,
    exportToExcel,
    disableSubmit,
    groupedData,
  };
};
