export type MovementType = "ingresos" | "gastos" | "ahorros";

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
  | "mercado_pago"
  | "btc"
  | "eth"
  | "otros";

export type AhorrosCategory =
  | "fintual"
  | "fintual_dolares"
  | "fondo_mutuo"
  | "us_home"
  | "dorada_be"
  | "cripto_bitcoin"
  | "cripto_eth"
  | "nvidia";

export interface BaseMovement {
  id: string;
  date: string;
  value: number;
}

export type PersonalFinance =
  | (BaseMovement & { type: "ingresos"; category: IngresosCategory })
  | (BaseMovement & { type: "gastos"; category: GastosCategory })
  | (BaseMovement & { type: "ahorros"; category: AhorrosCategory });

export interface CategoryOption {
  id: string;
  label: string;
  fijo: boolean;
}

export interface MovementFiltersProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedType: MovementType;
  setSelectedType: (value: MovementType) => void;
}

export interface MovementModalProps {
  modalType: MovementType;
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

export interface MovementListProps {
  filtrados: PersonalFinance[];
  isPrivate: boolean;
  setEditingItem: (id: string) => void;
  setCategory: (category: string) => void;
  setValue: (value: string) => void;
  setModalType: (value: MovementType) => void;
  setErrors: (id: MovementErrors) => void;
  handleDeleteMovement: (id: string) => void;
}

export type PersonalFinanceContextType = {
  movements: PersonalFinance[];
  summary: Summary;
  loading: boolean;
  getMovements: () => Promise<void>;
  addMovement: (m: PersonalFinance) => Promise<void>;
  updateMovement: (updated: PersonalFinance) => Promise<void>;
  deleteMovement: (id: string) => void;
  financial: Financial;
};

type MovementErrors = {
  category?: string;
  value?: string;
};
export type PersonalFinanceMovement = {
  id: string;
  type: MovementType;
  category: string;
  value: number;
  date: string;
};

export interface MovementFooterProps {
  total: number;
  isPrivate: boolean;
  handleOpenAddModal: () => void;
}

export type Summary = {
  ingresos: number;
  gastos: number;
  ahorros: number;
  saldo: number;
};

export interface Financial {
  current: {
    utm: number;
  };
}
