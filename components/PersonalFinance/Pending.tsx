import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useMovements } from "@/hooks/useMovements";
import { getPendingAndVariableExpenses } from "@/utils";
import { CreditCard, PiggyBank, CheckCircle2 } from "lucide-react";
import { useContext, useState } from "react";
import { MovementModal } from "./MovementModal";
import { specialCategoryRules } from "@/constants";
import { getTooltipClass } from "@/app/styles/labelStyles";

export const Pending = () => {
  const { movements } = useContext(PersonalFinanceContext)!;
  const [showAll, setShowAll] = useState(false);

  const pendingItems = getPendingAndVariableExpenses(movements, showAll);

  const {
    handleOpenAddModal,
    modalType,
    category,
    value,
    errors,
    selectedType,
    editingItem,
    resetModal,
    handleUpdateMovement,
    handleAddMovement,
    setCategory,
    setValue,
  } = useMovements();

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <PiggyBank size={25} className="text-indigo-600" />
              Gastos Pendientes
            </h2>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200"
          >
            {showAll ? "Ver solo pendientes" : "Ver todos los gastos"}
          </button>
          <div className="flex flex-col w-full gap-1">
            {pendingItems.length > 0 ? (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center border-b border-gray-100 py-3 px-2 hover:bg-indigo-50 transition-colors rounded-lg ${
                    !item.fijo ? "bg-gray-50/50" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.totalPaid > 0 && (
                      <span className="text-sm font-semibold text-green-600">
                        ${item.totalPaid.toLocaleString()}
                      </span>
                    )}

                    <div className="relative inline-block group">
                      <CreditCard
                        size={22}
                        onClick={() => handleOpenAddModal(item.id)}
                        className={`${
                          item.isPaid ? "text-green-500" : "text-blue-500"
                        } cursor-pointer hover:scale-110 transition-transform`}
                      />
                      <div
                        className={getTooltipClass({
                          type: "default",
                          inDev: false,
                        })}
                      >
                        {item.isPaid
                          ? `Añadir otro pago a ${item.label}`
                          : `Pagar ${item.label}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <CheckCircle2 className="mx-auto mb-2 opacity-20" size={40} />
                <p>No tienes pagos pendientes</p>
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
};
