import { MovementFooter } from "./MovementFooter";
import { Logs } from "lucide-react";
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
    handleInputKeyDown,
    resetModal,
  } = useMovements();

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4 gap-3">
            <h2 className="text-xl font-bold mb-2 border-b pb-1 w-full flex gap-2">
              <Logs size={25} />
              Movimientos
            </h2>

            <MovementFilters
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </div>

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
                onKeyDown={handleInputKeyDown}
              />
            )}
          </div>
        </div>
      </div>

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
