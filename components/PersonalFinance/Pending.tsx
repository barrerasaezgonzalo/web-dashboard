import { PersonalFinanceContext } from "@/context/PersonalFinanceContext";
import { getPendingAndVariableExpenses } from "@/utils";
import { PiggyBank, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useState } from "react";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

export const Pending = () => {
  const { movements } = useContext(PersonalFinanceContext)!;
  const [isMinimized, setIsMinimized] = useState(false);
  const pendingItems = getPendingAndVariableExpenses(movements);
  const { isPrivate } = usePrivacyMode();

  if (!movements || movements.length === 0) {
    return null;
  }
  return (
    <div
      id="pending"
      className={`bg-[#1E293C] text-white p-4 rounded shadow transition-all duration-300 ${
        isMinimized ? "min-h-0" : "min-h-[200px]"
      } overflow-x-auto`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex justify-between items-center border-b w-full ${!isMinimized && "mb-4"} pb-2`}
        >
          <h2 className="text-xl font-bold pb-2 flex items-center gap-2">
            <PiggyBank size={25} />
            Gastos Pendientes
          </h2>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-100 rounded transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {!isMinimized && (
          <>
            <div
              className={`flex flex-col w-full gap-1  ${isPrivate ? "privacy-blur" : ""} `}
            >
              {pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center border-b border-gray-100 py-3 px-2 transition-colors rounded-lg bg-gray-50 mb-2`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm uppercase pl-4 text-blue-500">
                        {item.label}
                      </span>
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
          </>
        )}
      </div>
    </div>
  );
};
