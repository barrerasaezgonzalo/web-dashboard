import { useGoals } from "@/hooks/useGoals";
import { useToast } from "@/hooks/useToast";
import { Check, Goal, Rocket } from "lucide-react";
import { Toast } from "../ui/Toast";

interface letterDaysType {
  [key: number]: string;
}

const letterDays: letterDaysType = {
  1: "L",
  2: "M",
  3: "X",
  4: "J",
  5: "V",
  6: "S",
  0: "D",
};

export const Goals = () => {
  const { toast, openToast, closeToast } = useToast();
  const { goals, handleGoalDone } = useGoals();
  const date = new Date();
  const day = date.getDay();
  const letterDay = letterDays[day];
  const filteredGoals = goals.filter((g) => {
    return g.days.includes(letterDay);
  });
  return (
    <div
      className="bg-blue-100 p-4 rounded shadow"
      role="region"
      aria-labelledby="tasks-heading"
    >
      {toast && (
        <Toast
          message={toast.message}
          onConfirm={() => {
            toast.onConfirm?.();
            closeToast();
          }}
          onCancel={
            toast.onCancel
              ? () => {
                  toast.onCancel?.();
                  closeToast();
                }
              : undefined
          }
        />
      )}
      <h2
        id="tasks-heading"
        className="flex gap-2 text-xl font-bold mb-4 border-b"
      >
        <Goal size={25} />
        Goals (Hoy: {letterDay})
      </h2>

      <ul role="list" className="mt-4">
        {filteredGoals.map((goal) => {
          const isDoneToday =
            goal.last_done === new Date().toLocaleDateString("en-CA");
          const isFinished = goal.days_done >= 21;

          return (
            <div
              key={goal.id}
              className={`p-4 mb-3 rounded-xl border transition-all ${
                isFinished
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`font-semibold ${isFinished ? "text-green-700 line-through" : "text-gray-800"}`}
                  >
                    {goal.title}
                  </h3>
                  <p
                    className={`text-xs ${isFinished ? "text-green-600" : "text-gray-400"}`}
                  >
                    {isFinished
                      ? "✅ Hábito consolidado"
                      : `Racha actual: ${goal.days_done || 0} de 21 días`}
                  </p>
                </div>

                {!isFinished && (
                  <button
                    disabled={isDoneToday}
                    onClick={() => {
                      openToast({
                        message: "¡Hábito realizado?",
                        onConfirm: async () => {
                          const result = await handleGoalDone(goal);
                          console.log("re", result);
                          closeToast();
                          if (result?.isFinished) {
                            openToast({
                              message: "¡Hábito consolidado!",
                              onConfirm: () => closeToast(),
                            });
                          } else if (result?.isReset) {
                            openToast({
                              message:
                                "Racha reiniciada a 1, se consecuente en los días",
                              onConfirm: () => closeToast(),
                            });
                          } else if (result?.newStreak) {
                            openToast({
                              message: `¡Sigue así! Día ${result?.newStreak} completado.`,
                              onConfirm: () => closeToast(),
                            });
                          }
                        },
                        onCancel: closeToast,
                      });
                    }}
                  >
                    <Rocket
                      size={25}
                      className={
                        isDoneToday
                          ? "text-green-500 cursor-not-allowed"
                          : "text-black cursor-pointer hover:scale-110 transition-transform"
                      }
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
