export interface CalendarEvent {
  titulo: string;
  hora: string;
  minutos: string;
  notas?: string;
  fecha?: string; // solo cuando viene del backend
}

export interface EventItemProps {
  ev: CalendarEvent;
  idx: number;
  horas: string[];
  minutos: string[];
  onUpdate: (index: number, field: keyof CalendarEvent, value: string) => void;
  onRemove: (index: number) => void;
}

export interface CalendarDayProps {
  dia: Date;
  esMesActual: boolean;
  tieneEvento: number;
  onClick: () => void;
}

export interface CalendarModalConfig {
  date: Date;
  onConfirm: (eventos: CalendarEvent[]) => Promise<void>;
  onCancel: () => void;
}

export interface EventModalComponentProps {
  date: string;
  eventsToday: CalendarEvent[];
  onConfirm: (eventos: CalendarEvent[]) => Promise<void>;
  onCancel: () => void;
}

export interface CalendarContextType {
  events: CalendarEvent[];
  getEvents: (mes: Date) => Promise<void>;
  saveEvents: (fecha: string, eventos: CalendarEvent[]) => Promise<void>;
  modalConfig: CalendarModalConfig | null;
  handleShowModal: (dia: Date) => void;
}
