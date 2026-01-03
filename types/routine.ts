export interface Routine {
  id: number;
  start_time: string; // Formato HH:mm:ss
  end_time: string; // Formato HH:mm:ss
  label: string;
  icon: string;
  done_count: number;
  done: boolean;
  last_updated: string;
  dias: "L-V" | "Finde" | "Todos";
}

export interface RoutineType {
  id: number;
  start_time: string;
  end_time: string;
  label: string;
  icon: string;
  done_count: number;
  done: boolean;
  last_updated: string;
}

export interface ProgressCircleProps {
  done_count: number;
}

export interface RoutineListProps {
  item: Routine;
  toggleDone: (item: Routine | null) => void;
  getBg: (doneCount: number, status: string) => string;
}
