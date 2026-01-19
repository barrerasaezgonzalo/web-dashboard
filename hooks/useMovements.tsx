import { useState, useMemo, useCallback, useContext } from "react";
import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { PersonalFinance, MovementType } from "@/types";
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
  const [errors, setErrors] = useState<{
    category?: string;
    value?: string;
    description?: string;
  }>({});
  const [selectedType, setSelectedType] = useState<MovementType>("gastos");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const filtrados = useMemo(() => {
    return context.movements.filter((m) => {
      const matchesType = m.type === selectedType;
      const matchesMonth = m.date.startsWith(selectedMonth);
      return matchesType && matchesMonth;
    });
  }, [context.movements, selectedType, selectedMonth]);

  const total = useMemo(() => {
    return filtrados.reduce((acc, curr) => acc + curr.value, 0);
  }, [filtrados]);

  const resetModal = useCallback(() => {
    setModalType(null);
    setCategory("");
    setValue("");
    setDescription("");
    setEditingItem(null);
    setErrors({});
  }, []);

  const validateFields = () => {
    const newErrors: { category?: string; value?: string } = {};

    if (!category) newErrors.category = "Categoría es requerida";

    const numericValue = Number(value);
    if (!value || isNaN(numericValue) || numericValue <= 0) {
      newErrors.value = "Ingresa un número válido mayor que cero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAddModal = useCallback(() => {
    setModalType(selectedType);
  }, [selectedType]);

  const handleOpenPendingPayment = useCallback((categoryId: string) => {
    setModalType("gastos");
    setCategory(categoryId);
    setValue("");
  }, []);

  const handleEditClick = useCallback((item: PersonalFinance) => {
    setEditingItem(item.id);
    setCategory(item.category);
    setDescription(item.description ?? "");
    setValue(item.value.toString());
    setModalType(item.type);
    setErrors({});
  }, []);

  const handleAddMovement = async () => {
    if (!validateFields()) return;
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
    } catch (error) {
      openToast({ message: "Error al agregar el movimiento" });
    }
  };

  const handleUpdateMovement = async () => {
    if (!editingItem || !validateFields()) return;
    try {
      const updated = {
        id: editingItem,
        type: modalType,
        category,
        description,
        value: Number(value),
        date: filtrados.find((f) => f.id === editingItem)?.date,
      } as PersonalFinance;

      await context.updateMovement(updated);
      resetModal();
      openToast({ message: "Movimiento actualizado" });
    } catch (error) {
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

  const checkInversionDorada = useMemo(() => {
    const VALOR_BASE = 2800000;
    const FACTOR = 6;
    const minimoDorada = VALOR_BASE * FACTOR;

    const totalAhorroDorada = context.movements
      .filter((m) => m.type === "ahorros" && m.category === "dorada_be")
      .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

    const canInvest = totalAhorroDorada >= minimoDorada;
    const falta = minimoDorada - totalAhorroDorada;

    return {
      canInvest,
      totalDorada: totalAhorroDorada,
      faltaDorada: falta > 0 ? falta : 0,
      minimoDorada,
    };
  }, [context.movements]);

  const summary = useMemo(() => {
    const movementsDelMes = context.movements.filter((m) =>
      m.date.startsWith(selectedMonth),
    );

    const ingresos = movementsDelMes
      .filter((m) => m.type === "ingresos")
      .reduce((acc, m) => acc + m.value, 0);

    const gastos = movementsDelMes
      .filter((m) => m.type === "gastos")
      .reduce((acc, m) => acc + m.value, 0);

    const ahorrosTotal = context.movements
      .filter((m) => m.type === "ahorros")
      .reduce((acc, m) => acc + m.value, 0);

    return {
      ingresos,
      gastos,
      ahorros: ahorrosTotal,
      saldo: ingresos - gastos,
    };
  }, [context.movements, selectedMonth]);

  const exportToExcel = (data: any[], periodName: string) => {
    const rows = data.map((item) => {
      const [year, month, day] = item.date.split("-");
      const fechaFormateada = `${day}/${month}/${year}`;

      return {
        FECHA: fechaFormateada,
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

  return {
    ...context,
    summary,
    modalType,
    category,
    description,
    value,
    editingItem,
    errors,
    filtrados,
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
    setErrors,
    handleOpenAddModal,
    handleAddMovement,
    handleUpdateMovement,
    handleDeleteMovement,
    handleEditClick,
    resetModal,
    ...checkInversionDorada,
    handleOpenPendingPayment,
    listaParaGráfico: context.movements,
    exportToExcel,
  };
};
