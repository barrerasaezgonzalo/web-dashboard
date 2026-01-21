export type MovementType = "income" | "bills" | "saving";

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
  | "ahorro"
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
  description?: string | undefined;
}

export type PersonalFinance =
  | (BaseMovement & { type: "income"; category: IngresosCategory })
  | (BaseMovement & { type: "bills"; category: GastosCategory })
  | (BaseMovement & { type: "saving"; category: AhorrosCategory });

export interface CategoryOption {
  id: string;
  label: string;
  fixed: boolean;
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
  description: string;
  value: string;
  specialCategoryRules: Record<string, (financial: Financial) => number>;
  selectedType: PersonalFinance["type"];
  editingItem: string | null;
  onClose: () => void;
  onSave: () => void;
  onChangeCategory: (category: string) => void;
  onChangeValue: (value: string) => void;
  onChangeDescription: (description: string) => void;
  disableSubmit: boolean;
}

export interface MovementListProps {
  isPrivate: boolean;
  onEdit: (item: PersonalFinanceMovement) => void;
  onDelete: (id: string) => void;
  graphList: PersonalFinanceMovement[];
  groupedData: Record<string, MovementGroup>;
}

export type PersonalFinanceContextType = {
  movements: PersonalFinance[];
  summary: Summary;
  loading: boolean;
  isPrivate: boolean;
  getMovements: () => Promise<void>;
  addMovement: (m: PersonalFinance) => Promise<void>;
  updateMovement: (updated: PersonalFinance) => Promise<void>;
  deleteMovement: (id: string) => void;
  financial: Financial;
};

export type PersonalFinanceMovement = {
  id: string;
  type: MovementType;
  category: string;
  value: number;
  date: string;
  description?: string;
};

export interface MovementFooterProps {
  total: number;
  isPrivate: boolean;
  handleOpenAddModal: () => void;
}

export type Summary = {
  income: number;
  bills: number;
  saving: number;
  balance: number;
};

export interface monthlyDataSummary extends Omit<Summary, "saldo"> {
  name: string;
  saldo?: number;
}
export interface Financial {
  current: {
    utm: number;
  };
}

export interface Movement {
  id: string;
  user_id: string;
  type: "saving" | "bills" | "income";
  category: string;
  value: number;
  date: string; // ISO format
  created_at?: string;
}

export type MovementGroup = {
  items: PersonalFinanceMovement[];
  total: number;
  type: "saving" | "bills" | "income";
  category: string;
};

export type PointGraphic = {
  month: string;
  value: number;
};

export type CategoryStat = {
  points: PointGraphic[];
  variation: number;
  hasComparison: boolean;
  pointsToGraph: PointGraphic[];
};
