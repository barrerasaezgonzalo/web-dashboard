export interface CalendarEvent {
  id?: string;
  fecha: string; // "YYYY-MM-DD"
  titulo: string;
  descripcion?: string;
  auth_data?: string;
}

export interface CalendarModalConfig {
  date: Date;
  onConfirm: (eventos: any[]) => Promise<void>;
  onCancel: () => void;
}
