import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
  addDays,
  isSameMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  TimerReset,
} from "lucide-react";
import { EventModal } from "./EventModal";
import { useCalendar } from "@/hooks/useCalendar";
import { diasSemana } from "@/constants";
import { CalendarDay } from "./CalendarDay";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

const Calendar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());
  const { events, modalConfig, handleShowModal } = useCalendar(mesActual);
  const { isPrivate } = usePrivacyMode();

  const { dias, inicioMes } = useMemo(() => {
    const inicio = startOfMonth(mesActual);
    const inicioCal = startOfWeek(inicio, { weekStartsOn: 1 });
    return {
      inicioMes: inicio,
      dias: eachDayOfInterval({
        start: inicioCal,
        end: addDays(inicioCal, 41),
      }),
    };
  }, [mesActual]);

  return (
    <div
      className={`
        bg-[#1E293C] 
        p-4 
        rounded
        shadow 
        transition-all 
        duration-500 
        ${isMinimized ? "min-h-0" : "min-h-72"}
      `}
    >
      <div
        id="calendario"
        className="flex justify-between items-center w-full pb-2 text-white"
      >
        <div className="flex justify-between items-center mb-4 border-b w-full! pb-2">
          <h2 className="text-xl flex gap-2 font-bold">
            <CalendarDays size={25} />
            Calendario
          </h2>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-500 rounded transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Navegación de Meses */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
            <button
              onClick={() => setMesActual(subMonths(mesActual, 1))}
              className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
            >
              <ChevronLeft size={25} />
            </button>
            <h3 className="text-lg font-bold capitalize">
              {format(mesActual, "MMMM yyyy", { locale: es })}
            </h3>
            {!isSameMonth(new Date(), mesActual) && (
              <div
                className="text-blue-500 cursor-pointer"
                onClick={() => setMesActual(new Date())}
              >
                <TimerReset size={25} />
              </div>
            )}
            <button
              onClick={() => setMesActual(addMonths(mesActual, 1))}
              className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
            >
              <ChevronRight size={25} />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="text-center text-xs font-semibold py-2 text-gray-500 uppercase"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div
            className={`grid grid-cols-7 text-sm ${isPrivate ? "privacy-blur" : ""}`}
          >
            {dias.map((dia, idx) => {
              const fechaKey = format(dia, "yyyy-MM-dd");
              const tieneEvento = events.some((ev) => ev.fecha === fechaKey);
              const esMesActual = isSameDay(startOfMonth(dia), inicioMes);

              return (
                <CalendarDay
                  key={idx}
                  dia={dia}
                  esMesActual={esMesActual}
                  tieneEvento={tieneEvento}
                  onClick={() => handleShowModal(dia)}
                />
              );
            })}
          </div>
        </>
      )}

      {modalConfig && (
        <EventModal
          date={format(modalConfig.date, "dd/MM/yyyy")}
          onConfirm={modalConfig.onConfirm || (async () => {})}
          onCancel={modalConfig.onCancel}
          eventsToday={events.filter(
            (ev) => ev.fecha === format(modalConfig.date, "yyyy-MM-dd"),
          )}
        />
      )}
    </div>
  );
};

export default Calendar;
