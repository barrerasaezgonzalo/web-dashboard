export interface Task {
  id: string;
  title: string;
  in_dev?: boolean;
  order?: number;
  date: string;
}

export interface TaskItemProps {
  task: Task;
  handleEdit: (task: Task) => void;
  handleRemove: (taskId: string) => void;
  handleTaskToggle: (taskId: string) => void;
}

export interface TaskInputProps {
  title: string;
  setTitle: (v: string) => void;
  date: string;
  setDate: (date: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.Ref<HTMLInputElement>;
  editingTaskId: string;
  handleAdd: () => void;
  handleSave: () => void;
  isLoading: boolean;
}

export interface TaskActionButtonProps {
  icon: React.ReactNode;
  tooltipType?: "default" | "success" | "danger";
  tooltipText: string;
  onClick?: () => void;
  inDev?: boolean;
}
