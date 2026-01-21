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
  ChevronLeft,
  ChevronRight,
  TimerReset,
} from "lucide-react";
import { EventModal } from "./EventModal";
import { useCalendar } from "@/hooks/useCalendar";
import { weekDays } from "@/constants";
import { CalendarDay } from "./CalendarDay";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events, modalConfig, handleShowModal } = useCalendar(currentMonth);
  const { isPrivate } = usePrivacyMode();

  const { days, monthStart } = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const startCalendar = startOfWeek(start, { weekStartsOn: 1 });
    return {
      monthStart: start,
      days: eachDayOfInterval({
        start: startCalendar,
        end: addDays(startCalendar, 41),
      }),
    };
  }, [currentMonth]);

  return (
    <div
      id="calendario"
      className={`
        bg-[#1E293C] 
        p-4 
        rounded
        shadow 
        transition-all 
        duration-500 
      `}
    >
      <div className="flex justify-between items-center w-full pb-2 text-white">
        <div className="flex justify-between items-center mb-4 border-b w-full! pb-2">
          <h2 className="text-xl flex gap-2 font-bold">
            <CalendarDays size={25} />
            Calendario
          </h2>
        </div>
      </div>

      <>
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <ChevronLeft size={25} />
          </button>
          <h3 className="text-lg font-bold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h3>
          {!isSameMonth(new Date(), currentMonth) && (
            <div
              className="text-blue-500 cursor-pointer"
              onClick={() => setCurrentMonth(new Date())}
            >
              <TimerReset size={25} />
            </div>
          )}
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
          >
            <ChevronRight size={25} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b bg-gray-50">
          {weekDays.map((dia) => (
            <div
              key={dia}
              className="text-center text-xs font-semibold py-2 text-gray-500 uppercase"
            >
              {dia}
            </div>
          ))}
        </div>

        <div
          className={`grid grid-cols-7 text-sm ${isPrivate ? "privacy-blur" : ""}`}
        >
          {days.map((dia, idx) => {
            const dateKey = format(dia, "yyyy-MM-dd");
            const hasEvent = events.some((ev) => ev.date === dateKey);
            const isCurrentMonth = isSameDay(startOfMonth(dia), monthStart);

            return (
              <CalendarDay
                key={idx}
                dia={dia}
                isCurrentMonth={isCurrentMonth}
                hasEvent={hasEvent}
                onClick={() => handleShowModal(dia)}
              />
            );
          })}
        </div>
      </>

      {modalConfig && (
        <EventModal
          date={format(modalConfig.date, "dd/MM/yyyy")}
          onConfirm={modalConfig.onConfirm || (async () => {})}
          onCancel={modalConfig.onCancel}
          eventsToday={events.filter(
            (ev) => ev.date === format(modalConfig.date, "yyyy-MM-dd"),
          )}
        />
      )}
    </div>
  );
};

export default Calendar;
