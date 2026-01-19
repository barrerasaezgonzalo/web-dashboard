import { ToastConfig } from "./ui";

export interface NotesListProps {
  openList: boolean;
  notes: Note[];
  setOpenList: (s: boolean) => void;
  openToast?: (config: ToastConfig) => void;
  handleDeleteNote: (note: Note) => void;
  handleClickNote: (note: Note) => void;
  handleFavoriteNote: (id: string) => void;
}

export interface Note {
  id: string;
  content: string;
  favorite?: boolean;
}
