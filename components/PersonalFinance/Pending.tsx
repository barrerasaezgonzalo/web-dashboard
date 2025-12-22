import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { getUnpaidExpensesForCurrentMonth } from "@/utils";
import { PiggyBank } from "lucide-react";
import { useContext } from "react";

export const Pending = () => {
  const { movements } = useContext(PersonalFinanceContext)!;
  const unpaidExpensesForMonth = getUnpaidExpensesForCurrentMonth(movements);
  return (
    <div className=" bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between mb-6  pb-4 gap-3">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 w-full flex gap-2">
              <PiggyBank size={25} />
              Pendientes de pago
            </h2>

            <div className="flex flex-col gap-3 w-full">
              {unpaidExpensesForMonth.map((item) => (
                <div
                  key={item.category}
                  className="text-red-500 font-bold border-b border-black"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
