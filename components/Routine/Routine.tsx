"use client";
import * as Icons from "lucide-react";
import { useRoutine } from "@/hooks/useRoutine";
import { useToast } from "@/hooks/useToast";
import { RoutineList } from "./RoutineList";
import { RoutineType } from "@/types/";
import { useCallback } from "react";
import { Skeleton } from "../ui/Skeleton";
import { Toast } from "../ui/Toast";

export const Routine: React.FC = () => {
  const { data, toggleDone, getBg, loading } = useRoutine();
  const { showToast, toast } = useToast();
  const routine = data;

  const handleDone = useCallback(
    async ({ item }: { item: RoutineType }) => {
      const toDay = new Date().toISOString().split("T")[0];
      const lastRecord = item.last_updated
        ? item.last_updated.split("T")[0]
        : null;
      const alreadyDoneToday = lastRecord === toDay;

      if (item.done_count >= 21) {
        showToast("¡Felicidades! Ya completaste este hábito de 21 días");
        return;
      }
      if (alreadyDoneToday) {
        showToast("Ya registraste tu progreso de hoy. ¡Vuelve mañana!");
        return;
      }

      const result = await toggleDone(
        item.id,
        item.done_count,
        item.last_updated,
      );
      if (result?.success) {
        showToast("Hábito ingresado correctamente");
      }
    },
    [toggleDone, showToast],
  );

  if (loading) return <Skeleton rows={10} height={40} />;

  return (
    <div
      className="bg-blue-50 text-black p-4 rounded shadow"
      role="region"
      aria-labelledby="routine-heading"
    >
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm?.();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                }
              : undefined
          }
        />
      )}
      <h2
        id="routine-heading"
        className="text-xl flex gap-2 font-bold mb-4 border-b border-blue-300"
      >
        <Icons.Coffee size={20} /> Rutina
      </h2>

      <ul>
        {routine.map((item) => (
          <RoutineList
            key={item.id}
            item={item}
            toggleDone={() => handleDone({ item })}
            getBg={getBg}
          />
        ))}
      </ul>
    </div>
  );
};
