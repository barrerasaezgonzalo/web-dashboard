"use client"; // Asegúrate de tener esto arriba

import { useState } from "react"; // 1. Importar useState
import { ChevronUp, ChevronDown, Logs } from "lucide-react"; // 2. Importar iconos
import { MovementFooter } from "./MovementFooter";
import { specialCategoryRules } from "@/constants";
import { Toast } from "../ui/Toast";
import { useMovements } from "@/hooks/useMovements";
import { MovementModal } from "./MovementModal";
import { MovementFilters } from "./MovementFilters";
import { MovementList } from "./MovementList";

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
    isPrivate,
    toast,
    setCategory,
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
    resetModal,
  } = useMovements();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="bg-white rounded from-blue-50 to-indigo-100 p-6 transition-all">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex flex-wrap items-center justify-between ${!isMinimized && "pb-4"} gap-3`}
        >
          <div className="flex justify-between items-center w-full border-b pb-2">
            <h2 className="text-xl font-bold flex gap-2 items-center">
              <Logs size={25} />
              Movimientos
            </h2>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isMinimized ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronUp size={24} />
              )}
            </button>
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
              setEditingItem={setEditingItem}
              setCategory={setCategory}
              setValue={setValue}
              setModalType={setModalType}
              setErrors={setErrors}
              handleDeleteMovement={handleDeleteMovement}
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
          value={value}
          errors={errors}
          specialCategoryRules={specialCategoryRules}
          selectedType={selectedType}
          editingItem={editingItem}
          onClose={resetModal}
          onSave={editingItem ? handleUpdateMovement : handleAddMovement}
          onChangeCategory={setCategory}
          onChangeValue={setValue}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </div>
  );
}
