"use client";

import { Smile } from "lucide-react";
import { getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useUser } from "@/context/UserContext";

export const User: React.FC = ({}) => {
  const { tasks } = useTasks();
  const inDevTask = tasks.filter((task) => task.in_dev).length;
  const pending = tasks.length - inDevTask;
  const { userName } = useUser();

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
        {getGreeting()}, {userName}! <Smile className="text-yellow-300" />
      </p>

      <p className="text-center text-lg">
        Tienes <span className="font-bold">{inDevTask}</span> tareas en curso y{" "}
        <span className="font-bold text-red-300">{pending}</span> pendientes.
      </p>
    </div>
  );
};
