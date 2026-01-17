"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Logs } from "lucide-react";
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
  } = useMovements();

  const [isMinimized, setIsMinimized] = useState(false);
  const { isPrivate } = usePrivacyMode();

  return (
    <div className="bg-white rounded p-6 transition-all">
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
              className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
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
              onEdit={handleEditClick}
              onDelete={handleDeleteMovement}
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
          editingItem={editingItem || ""}
          onClose={resetModal}
          onSave={editingItem ? handleUpdateMovement : handleAddMovement}
          onChangeCategory={setCategory}
          onChangeValue={setValue}
        />
      )}
    </div>
  );
}
