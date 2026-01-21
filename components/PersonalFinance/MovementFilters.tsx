import { typeLabels } from "@/constants";
import { MovementFiltersProps, PersonalFinance } from "@/types/";
import { generateMonthOptions } from "@/utils";

export const MovementFilters: React.FC<MovementFiltersProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
}) => {
  return (
    <div className="flex gap-3 w-full justify-between mb-4">
      <div className="relative">
        <select
          className="w-30 bg-slate-900 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer border-slate-700 focus:ring-blue-500/50"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {generateMonthOptions()}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          className="w-30 bg-slate-900 border rounded-xl p-3 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer border-slate-700 focus:ring-blue-500/50"
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value as PersonalFinance["type"])
          }
        >
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key} className="bg-slate-900">
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
