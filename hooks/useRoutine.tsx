import { useState, useEffect } from "react";
import type { Routine } from "@/types/";
import { supabase } from "@/lib/supabaseClient";

export const useRoutine = () => {
  const [data, setData] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const getBg = (doneCount: number, status: string) => {
    if (status === "current") return "bg-green-300";
    if (status === "past") return "bg-gray-200 text-black/70";

    switch (doneCount) {
      case 21:
        return "bg-green-500";
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
        return "bg-green-300";
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return "bg-yellow-300";
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return "bg-orange-200";
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return "bg-gray-100";
      default:
        return "bg-transparent";
    }
  };

  const fetchRoutine = async () => {
    try {
      setLoading(true);

      const { data: routine, error } = await supabase
        .from("routine")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) throw error;

      setData(routine || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (
    id: number,
    currentCount: number,
    lastUpdated: string | null,
  ) => {
    if (updatingIds.includes(id)) return;
    setUpdatingIds((prev) => [...prev, id]);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const lastUpdateStr = lastUpdated ? lastUpdated.split("T")[0] : null;

    if (lastUpdateStr === todayStr) {
      setUpdatingIds((prev) => prev.filter((uid) => uid !== id));
      return { success: false, reason: "ALREADY_DONE" };
    }

    try {
      const newCount = currentCount + 1;
      const isNowDone = newCount >= 21;
      const nowIso = new Date().toISOString();

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                done_count: newCount,
                done: isNowDone,
                last_updated: nowIso,
              }
            : item,
        ),
      );

      const { error } = await supabase
        .from("routine")
        .update({ done_count: newCount, done: isNowDone, last_updated: nowIso })
        .eq("id", id);

      if (error) throw error;

      return { success: true, isHabitCompleted: isNowDone };
    } catch (err) {
      fetchRoutine();
      return { success: false, reason: "ERROR" };
    } finally {
      setUpdatingIds((prev) => prev.filter((uid) => uid !== id));
    }
  };
  useEffect(() => {
    fetchRoutine();
  }, []);

  return { data, loading, error, refresh: fetchRoutine, toggleDone, getBg };
};
