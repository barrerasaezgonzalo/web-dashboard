"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Notes } from "@/components/Notes/Notes";
import { User } from "@/components/User/User";
import { BackGround } from "@/components/ui/BackGround";
import { Images } from "@/components/Images/Images";
import { Sidebar } from "@/components/ui/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { PersonalFinance } from "@/components/PersonalFinance/PersonalFinance";
import { Pending } from "@/components/PersonalFinance/Pending";
import { MainProvider } from "./MainProvider";
import { BankReconciliation } from "@/components/PersonalFinance/BankReconciliation";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { useHashHighlight } from "@/hooks/useHashHighlight";

const Task = dynamic(() => import("@/components/Task/Task"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Movements = dynamic(
  () => import("@/components/PersonalFinance/Movements"),
  {
    ssr: false,
    loading: () => <Skeleton rows={5} height={40} />,
  },
);

const Calendar = dynamic(() => import("@/components/Calendar/Calendar"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-900/50 animate-pulse rounded-3xl border border-slate-800 flex items-center justify-center">
      <span className="text-slate-500 font-medium">Cargando calendario...</span>
    </div>
  ),
});

export const App: React.FC = () => {
  useHashHighlight();
  const { userId, loading, signInWithGoogle } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!userId) return <LoginScreen onLogin={signInWithGoogle} />;

  const columnStyle = "break-inside-avoid";
  const rowSpacer = "break-inside-avoid h-4 w-full block";

  return (
    <MainProvider>
      <div className="relative w-full min-h-screen">
        <BackGround />
        <Sidebar />
        <main className="relative z-10 p-4 columns-1 sm:columns-2 lg:columns-2 xl:columns-4 gap-4 space-y-4">
          <div className={columnStyle}>
            <ErrorBoundary>
              <User />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
            <ErrorBoundary>
              <Calendar />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
            <ErrorBoundary>
              <Images />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
          </div>

          <div className={columnStyle}>
            <ErrorBoundary>
              <Movements />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
          </div>

          <div className={columnStyle}>
            <ErrorBoundary>
              <PersonalFinance />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
            <ErrorBoundary>
              <BankReconciliation />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
            <ErrorBoundary>
              <Notes />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
          </div>

          <div className={columnStyle}>
            <ErrorBoundary>
              <Task />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
            <ErrorBoundary>
              <Pending />
            </ErrorBoundary>
            <div className={rowSpacer}></div>
          </div>
        </main>
      </div>
      <ScrollToTop />
    </MainProvider>
  );
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
    <div className="animate-pulse text-blue-400 font-medium">
      Cargando dashboard...
    </div>
  </div>
);

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center max-w-md w-full">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">Dashboard</h1>
      <p className="text-slate-400 mb-8 text-center text-sm">
        Gestiona tus proyectos y finanzas en un solo lugar.
      </p>
      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
      >
        Continuar con Google
      </button>
    </div>
  </div>
);

export default App;
