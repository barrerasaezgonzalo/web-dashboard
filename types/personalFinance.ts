export type PersonalFinance =
  | {
      id: string;
      type: "ingresos";
      date: string;
      value: number;
      category: IngresosCategory;
    }
  | {
      id: string;
      type: "gastos";
      date: string;
      value: number;
      category: GastosCategory;
    }
  | {
      id: string;
      type: "ahorros";
      date: string;
      value: number;
      category: AhorrosCategory;
    };

export type IngresosCategory = "sueldo" | "otros";
export type GastosCategory =
  | "arriendo"
  | "gastos_comunes"
  | "luz"
  | "agua"
  | "fa"
  | "celular"
  | "internet"
  | "apv"
  | "fintual"
  | "comisiones"
  | "fondo_mutuo"
  | "bip"
  | "mercado_pago";
export type AhorrosCategory =
  | "fintual"
  | "fintual_dolares"
  | "fondo_mutuo"
  | "us_home"
  | "dorada_be"
  | "cripto_bitcoin"
  | "cripto_eth"
  | "nvidia";

export interface MovementFiltersProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedType: PersonalFinance["type"];
  setSelectedType: (value: PersonalFinance["type"]) => void;
}

export type PersonalFinanceMovement = {
  id: string;
  type: ResumeType;
  category: string;
  value: number;
  date: string;
};

export type MovementTypes = "gastos" | "ahorros" | "ingresos";

export type ResumeType = "ingresos" | "gastos" | "ahorros";

export interface MovementModalProps {
  modalType: MovementTypes;
  category: string;
  value: string;
  errors: { category?: string; value?: string };
  specialCategoryRules: Record<string, (financial: any) => number>;
  selectedType: PersonalFinance["type"];
  editingItem: string;
  onClose: () => void;
  onSave: () => void;
  onChangeCategory: (category: string) => void;
  onChangeValue: (value: string) => void;
}

export type PersonalFinanceContextType = {
  movements: PersonalFinance[];
  summary: Summary;
  loading: boolean;
  getMovements: () => Promise<void>;
  addMovement: (m: PersonalFinance) => Promise<void>;
  updateMovement: (updated: PersonalFinanceMovement) => Promise<void>;
  deleteMovement: (id: string) => void;
};

export type Summary = {
  ingresos: number;
  gastos: number;
  ahorros: number;
  saldo: number;
};

type MovementErrors = {
  category?: string;
  value?: string;
};

export interface MovementListProps {
  filtrados: PersonalFinance[];
  isPrivate: boolean;
  setEditingItem: (id: string) => void;
  setCategory: (id: string) => void;
  setValue: (id: string) => void;
  setModalType: (value: MovementTypes) => void;
  setErrors: (id: MovementErrors) => void;
  handleDeleteMovement: (id: string) => void;
}

export interface MovementFooterProps {
  total: number;
  isPrivate: boolean;
  handleOpenAddModal: () => void;
}
