import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export interface Goal {
  id: string; // UUID
  title: string;
  days_done: number;
  pending_days: number;
  last_done: string | null; // ISO Date string o null
  delay: number;
  days: string; // Ej: "L,M,X,J,V,S,D"
  created_at?: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoalDone = async (goal: Goal) => {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA");

    // Mapeo para JS (0 = Domingo, 1 = Lunes...)
    const daysMap = ["D", "L", "M", "X", "J", "V", "S"];
    const todayDayName = daysMap[today.getDay()];

    let nextStreak = 1;

    if (goal.last_done) {
      // Convertimos "L,X,V" en ['L', 'X', 'V']
      const allowedDays = goal.days.split(",").map((d) => d.trim());

      const lastDoneDate = new Date(goal.last_done + "T00:00:00");
      const todayDate = new Date(todayStr + "T00:00:00");
      const diffInDays = Math.floor(
        (todayDate.getTime() - lastDoneDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 0) return; // Evitar duplicados hoy

      let missedADay = false;

      // Revisamos los días que pasaron entre la última vez y hoy
      for (let i = 1; i < diffInDays; i++) {
        const checkDate = new Date(lastDoneDate);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDayName = daysMap[checkDate.getDay()];

        // Si el día que saltamos estaba en la lista "L,X,V", entonces falló
        if (allowedDays.includes(checkDayName)) {
          missedADay = true;
          break;
        }
      }

      if (!missedADay) {
        nextStreak = (goal.days_done || 0) + 1;
      }
      // Si missedADay es true, nextStreak se queda en 1 (Reseteo)
    }

    const isFinished = nextStreak >= 21;

    // Update en Supabase
    const { error } = await supabase
      .from("goals")
      .update({
        days_done: nextStreak,
        last_done: todayStr,
        is_completed: isFinished,
      })
      .eq("id", goal.id);

    if (!error) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id
            ? {
                ...g,
                days_done: nextStreak,
                last_done: todayStr,
                is_completed: isFinished,
              }
            : g,
        ),
      );

      // Retornamos para el Toast del componente
      return {
        isReset: nextStreak === 1 && goal.days_done > 0,
        isFinished,
        newStreak: nextStreak,
      };
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: true });

      if (supabaseError) throw supabaseError;

      setGoals(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, error, refresh: fetchGoals, handleGoalDone };
};
