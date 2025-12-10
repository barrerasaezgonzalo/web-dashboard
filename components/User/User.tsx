"use client";

import { Smile } from "lucide-react";
import { getGreeting } from "@/utils";
import { useTasks } from "@/hooks/useTasks";
import { useData } from "@/hooks/useData";

export const User: React.FC = ({}) => {
  const { tasks } = useTasks();
  const inDevTask = tasks.filter(task => task.in_dev).length;
  const pending = tasks.length - inDevTask;
  const { user } = useData();

  return (
    <div className={`
        bg-slate-600
        text-white
        p-4
        rounded 
        shadow
      `} data-testid="User">

      <p className="text-center text-4xl mb-2 mx-4 flex items-left gap-2">
        {getGreeting()}, {user}! <Smile className="text-yellow-300" />
      </p>

      <p className="text-center text-lg">
        Tienes <span className="font-bold">{inDevTask}</span> tareas en curso
        y <span className="font-bold text-red-300">{pending}</span> pendientes.
      </p>

    </div>

  );
};
