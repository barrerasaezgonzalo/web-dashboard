"use client";
import * as XLSX from "xlsx";
import { useState } from "react";
import { ChevronUp, ChevronDown, Logs, Plus, Download } from "lucide-react";
import { MovementFooter } from "./MovementFooter";
import { specialCategoryRules } from "@/constants";
import { useMovements } from "@/hooks/useMovements";
import { MovementModal } from "./MovementModal";
import { MovementFilters } from "./MovementFilters";
import { MovementList } from "./MovementList";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

export default function Movements() {
  const {
    modalType,
    category,
    value,
    editingItem,
    errors,
    filtrados,
    total,
    selectedType,
    selectedMonth,
    description,
    setCategory,
    setValue,
    setSelectedType,
    setSelectedMonth,
    handleOpenAddModal,
    handleAddMovement,
    handleUpdateMovement,
    handleDeleteMovement,
    handleEditClick,
    resetModal,
    setDescription,
    listaParaGráfico,
  } = useMovements();

  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();

  const exportToExcel = (data: any[], periodName: string) => {
    // 1. Mapear y formatear los datos
    const rows = data.map((item) => {
      // Convertir YYYY-MM-DD a DD/MM/YYYY
      const [year, month, day] = item.date.split("-");
      const fechaFormateada = `${day}/${month}/${year}`;

      return {
        FECHA: fechaFormateada,
        TIPO: item.type.toUpperCase(),
        CATEGORÍA:
          item.category.charAt(0).toUpperCase() + item.category.slice(1),
        DESCRIPCIÓN: item.description || "-",
        MONTO: Number(item.value), // Enviarlo como número para que Excel pueda sumar
      };
    });

    // 2. Crear la hoja
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // 3. Definir anchos de columna para que no se vea apretado (UX de Excel)
    const columnWidths = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Tipo
      { wch: 15 }, // Categoría
      { wch: 30 }, // Descripción
      { wch: 12 }, // Monto
    ];
    worksheet["!cols"] = columnWidths;

    // 4. Crear el libro y descargar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzas");

    // El nombre del archivo será algo como: Reporte_Enero_2026.xlsx
    XLSX.writeFile(workbook, `Reporte_${periodName.replace(" ", "_")}.xlsx`);
  };

  return (
    <div
      className={`bg-[#1E293C] p-4 rounded shadow transition-all duration-300 ${isMinimized ? "min-h-0" : "min-h-[200px]"} overflow-x-auto  text-white`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex flex-wrap items-center justify-between ${!isMinimized && "pb-4"} gap-3`}
        >
          <div className="flex justify-between items-center w-full border-b pb-2 text-white">
            <h2 className="text-xl font-bold flex gap-2 items-center">
              <Logs size={25} />
              Movimientos
            </h2>
            <div className="flex items-center gap-1">
              <button
                title="Nuevo Movimiento"
                className="p-2 rounded hover:bg-blue-500 cursor-pointer transition-colors text-white"
                onClick={handleOpenAddModal}
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => exportToExcel(filtrados, selectedMonth)}
                className="p-2 rounded hover:bg-blue-500 cursor-pointer transition-colors text-white"
                title="Exportar vista actual"
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-blue-400 rounded transition-colors cursor-pointer"
              >
                {isMinimized ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronUp size={24} />
                )}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <MovementFilters
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          )}
        </div>

        {!isMinimized && (
          <div className="flex flex-col gap-4">
            <MovementList
              filtrados={filtrados}
              isPrivate={isPrivate}
              onEdit={handleEditClick}
              onDelete={handleDeleteMovement}
              listaParaGráfico={listaParaGráfico}
            />

            <MovementFooter
              total={total}
              isPrivate={isPrivate}
              handleOpenAddModal={handleOpenAddModal}
            />
          </div>
        )}
      </div>

      {modalType && (
        <MovementModal
          modalType={modalType}
          category={category}
          description={description}
          value={value}
          errors={errors}
          specialCategoryRules={specialCategoryRules}
          selectedType={selectedType}
          editingItem={editingItem || ""}
          onClose={resetModal}
          onSave={editingItem ? handleUpdateMovement : handleAddMovement}
          onChangeCategory={setCategory}
          onChangeValue={setValue}
          onChangeDescription={setDescription}
        />
      )}
    </div>
  );
}
