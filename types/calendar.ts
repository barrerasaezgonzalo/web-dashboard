export interface CalendarEvent {
  title: string;
  hour: string;
  minutes: string;
  notes?: string;
  date?: string; // solo cuando viene del backend
  id?: string;
}

export interface EventItemProps {
  ev: CalendarEvent;
  idx: number;
  hours: string[];
  minutes: string[];
  onUpdate: (index: number, field: keyof CalendarEvent, value: string) => void;
  onRemove: (index: number) => void;
}

export interface CalendarDayProps {
  dia: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
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
  getEvents: (month: Date) => Promise<void>;
  saveEvents: (date: string, eventos: CalendarEvent[]) => Promise<void>;
  modalConfig: CalendarModalConfig | null;
  handleShowModal: (dia: Date) => void;
}
