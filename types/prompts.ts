export interface ParsedData {
  title: string;
  objective: string;
  instructions: string;
  context: string;
  examples: string[];
  expected_output: string;
}

export interface PromptData {
  title: string;
  objective: string;
  instructions: string;
  context: string;
  examples: string[];
  expected_output: string;
}

export interface ParsedDataViewProps {
  data: ParsedData;
  onEnviar: () => void;
}

export interface AutoTextareaProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

export interface ActionButtonsProps {
  loading: boolean;
  onAdd: () => void;
  onCopy: () => void;
}
