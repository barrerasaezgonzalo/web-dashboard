import {
  BookOpen,
  Code,
  Coffee,
  Computer,
  CookingPot,
  Footprints,
  Ghost,
  Guitar,
  Hamburger,
  Library,
  ListTodo,
  MonitorPlay,
  PocketKnife,
  Settings,
  Sunrise,
} from "lucide-react";
import { useEffect, useState } from "react";

const routine = [
  {
    start: "07:00",
    end: "07:30",
    label: "Despertar y estiramiento",
    icon: <Sunrise />,
  },
  {
    start: "07:30",
    end: "08:30",
    label: "Tiempo de Aprendizaje",
    icon: <Library />,
  },
  { start: "08:30", end: "09:00", label: "Desayuno", icon: <Coffee /> },
  {
    start: "09:00",
    end: "13:00",
    label: "Bloque de trabajo profundo",
    icon: <Code />,
  },
  { start: "13:00", end: "13:30", label: "Almuerzo", icon: <Hamburger /> },
  { start: "13:30", end: "14:00", label: "Caminata", icon: <Footprints /> },
  {
    start: "14:00",
    end: "18:00",
    label: "Bloque de trabajo profundo",
    icon: <Code />,
  },
  { start: "18:00", end: "18:30", label: "Guitarra", icon: <Guitar /> },
  {
    start: "18:30",
    end: "19:00",
    label: "Actividades del hogar",
    icon: <PocketKnife />,
  },
  { start: "19:00", end: "19:30", label: "Cena", icon: <CookingPot /> },
  { start: "19:30", end: "20:30", label: "Series", icon: <MonitorPlay /> },
  {
    start: "20:30",
    end: "21:00",
    label: "Planificación / Administrativas",
    icon: <Settings />,
  },
  { start: "21:00", end: "22:00", label: "PC", icon: <Computer /> },
  { start: "22:00", end: "22:30", label: "Lectura", icon: <BookOpen /> },
  { start: "22:30", end: "23:00", label: "Relax", icon: <Ghost /> },
];

export const Routine = () => {
  const [currentHour, setCurrentHour] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const nowH = currentHour.getHours();
    const nowM = currentHour.getMinutes();

    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;
    const nowTime = nowH * 60 + nowM;

    if (nowTime >= startTime && nowTime < endTime) return "current";
    if (nowTime > endTime) return "past";
    return "future";
  };

  return (
    <div
      className="bg-blue-50 text-black p-4 rounded shadow"
      role="region"
      aria-labelledby="routine-heading"
    >
      <h2
        id="routine-heading"
        className="text-xl flex gap-2 font-bold mb-4 border-b border-blue-300"
      >
        <ListTodo size={25} /> Rutina
      </h2>

      <ul>
        {routine.map((item, idx) => {
          const status = getStatus(item.start, item.end);
          let bg = "bg-transparent";
          if (status === "current") bg = "bg-green-400 text-white";
          if (status === "past") bg = "bg-gray-200 text-black/70";

          return (
            <li key={idx} className={`my-2 p-2 rounded ${bg} flex gap-4`}>
              <input type="checkbox" />
              {item.icon}
              {item.start} – {item.end}: {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
