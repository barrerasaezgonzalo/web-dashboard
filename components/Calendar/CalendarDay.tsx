import { CalendarDayProps } from "@/types";
import { format, isToday } from "date-fns";

export const CalendarDay = ({
  dia,
  esMesActual,
  tieneEvento,
  onClick,
}: CalendarDayProps) => {
  return (
    <div
      className={`h-12 border-b border-r flex flex-col items-center justify-start p-1 cursor-pointer hover:bg-blue-100 transition-colors
            ${!esMesActual ? "bg-gray-50 text-gray-400" : "text-gray-700"}
            ${isToday(dia) ? "bg-blue-300 font-bold  text-white" : "bg-gray-50"}`}
      onClick={onClick}
    >
      <span>{format(dia, "d")}</span>

      {tieneEvento && (
        <div className="mt-1 w-full px-1 bg-blue-500 text-[10px] text-white p-1 rounded truncate shadow-sm"></div>
      )}
    </div>
  );
};
