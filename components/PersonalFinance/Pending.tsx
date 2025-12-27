import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { useMovements } from "@/hooks/useMovements";
import { getUnpaidExpensesForCurrentMonth } from "@/utils";
import { CreditCard, PiggyBank } from "lucide-react";
import { useContext } from "react";
import { MovementModal } from "./MovementModal";
import { specialCategoryRules } from "@/constants";
import { getTooltipClass } from "@/app/styles/labelStyles";

export const Pending = () => {
  const { movements } = useContext(PersonalFinanceContext)!;
  const unpaidExpensesForMonth = getUnpaidExpensesForCurrentMonth(movements);
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
          <div className="flex flex-wrap items-center justify-between mb-6 pb-4 gap-3">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 w-full flex gap-2">
              <PiggyBank size={25} />
              Pendientes de pago
            </h2>

            <div className="flex flex-col  w-full">
              {unpaidExpensesForMonth.map((item) => (
                <div
                  key={item.category}
                  className="flex justify-between items-center border-b border-gray-200 py-1 hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>

                  <div className="relative inline-block group">
                    <CreditCard
                      size={25}
                      onClick={() => handleOpenAddModal(item.category)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                    />
                    <div
                      className={getTooltipClass({
                        type: "default",
                        inDev: false,
                      })}
                    >
                      Pagar {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
