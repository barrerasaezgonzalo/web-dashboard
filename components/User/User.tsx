"use client";

import { Smile } from "lucide-react";
import { getDaysRemainingUntil, getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";

export const User: React.FC = ({}) => {
  const { tasks } = useTasks();
  const inDevTask = tasks.filter((task) => task.in_dev).length;
  const pending = tasks.filter(
    (task) =>
      !task.in_dev && task.date && getDaysRemainingUntil(task.date) >= 0,
  ).length;
  const { userName } = useUser();
  const overdueTasks = tasks.filter(
    (task) => !task.in_dev && task.date && getDaysRemainingUntil(task.date) < 0,
  ).length;

  return (
    <div
      role="region"
      aria-labelledby="user-heading"
      className={`
        bg-slate-600
        text-white
        p-4
        rounded 
        shadow
      `}
      data-testid="User"
    >
      <p
        id="user-heading"
        className="text-center text-4xl mb-2 mx-4 flex items-left gap-2"
      >
        {getGreeting()}, {userName?.split(" ")[0]}!{" "}
        <Smile className="text-yellow-300" />
      </p>

      <p className="text-center text-lg">
        Tienes <span className="font-bold">{inDevTask}</span> tareas en curso,{" "}
        <span className="font-bold text-red-300">{pending} pendientes </span>
        (aún a tiempo)
        {overdueTasks > 0 && (
          <>
            {" "}
            y{" "}
            <span className="font-bold text-orange-300">
              {overdueTasks} vencidas
            </span>
          </>
        )}
      </p>
    </div>
  );
};
