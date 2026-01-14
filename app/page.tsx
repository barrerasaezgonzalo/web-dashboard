"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Notes } from "@/components/Notes/Notes";
import { User } from "@/components/User/User";
import { BackGround } from "@/components/ui/BackGround";
import { TasksProvider } from "@/context/TasksContext";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { PersonalFinance } from "@/components/PersonalFinance/PersonalFinance";
import { Pending } from "@/components/PersonalFinance/Pending";
import { PersonalFinanceProvider } from "@/context/PersonalFinanceContext";

const Task = dynamic(() => import("@/components/Task/Task"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Movements = dynamic(
  () => import("@/components/PersonalFinance/Movements"),
  { ssr: false, loading: () => <Skeleton rows={5} height={40} /> },
);

const Calendar = dynamic(
  () => import("@/components/Calendar/Calendar").then((mod) => mod.Calendar),
  {
    ssr: false,
  },
);

export const App: React.FC = () => {
  const columnStyle = "flex flex-col gap-4 w-full";
  const { userId, loading } = useAuth();

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Login error:", error.message);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-500 text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-400">
            Bienvenido al Dashboard
          </h1>
          <p className="text-slate-400 mb-8 text-center">
            Organiza tus tareas, finanzas y calendario <br /> en un solo lugar.
          </p>

          <button
            onClick={loginWithGoogle}
            className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            {/* Aquí podrías poner un iconito de Google */}
            Continuar con Google
          </button>
        </div>
      </div>
    );
  }

  const column1 = (
    <div className={columnStyle}>
      <ErrorBoundary>
        <User />
      </ErrorBoundary>
      <ErrorBoundary>
        <Calendar />
      </ErrorBoundary>
      <ErrorBoundary>
        <Notes />
      </ErrorBoundary>
    </div>
  );

  const column2 = (
    <div className={columnStyle}>
      <ErrorBoundary>
        <Movements />
      </ErrorBoundary>
    </div>
  );

  const column3 = (
    <div className={columnStyle}>
      <ErrorBoundary>
        <PersonalFinance />
      </ErrorBoundary>
      <ErrorBoundary>
        <Pending />
      </ErrorBoundary>
    </div>
  );

  const column4 = (
    <div className={columnStyle}>
      <ErrorBoundary>
        <Task />
      </ErrorBoundary>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen">
      <BackGround />
      <div
        className="relative z-10 p-4 grid gap-4 
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-2 
                  lg:grid-cols-4"
      >
        <ErrorBoundary>
          <TasksProvider>
            <PersonalFinanceProvider>
              {column1}
              {column2}
              {column3}
              {column4}
            </PersonalFinanceProvider>
          </TasksProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
