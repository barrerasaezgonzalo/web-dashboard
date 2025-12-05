export interface Task {
  id: string;
  title: string;
  completed?: boolean;
  order: number;
}

export interface TopSite {
  id: number;
  titulo: string;
  url: string;
}

export type PhrasesType = {
  titulo: string;
};

export interface PhrasesProps {
  pharses: PhrasesType[];
}

export interface TopSitesProps {
  topSites: TopSite[];
}

export interface ToastProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface Financial {
  dolar: string;
  utm: string;
  btc: string;
  eth: string;
}

export interface FinancialProps {
  financial: Financial;
  financialLoading: boolean;
}

export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: NewsSource;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface News extends NewsResponse {
  _fallback?: boolean;
}

export interface NewsListProps {
  news: News;
}

export interface PromptsData {
  getPrompt: (input?: string) => Promise<string | null>;
}

export interface TaskProps {
  tasks: Task[];
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
  toggleTaskCompletion: (id: string) => void;
  tasksLoading: boolean;
  updateTasksOrder: (tasks: Task[]) => Promise<void>;
}
