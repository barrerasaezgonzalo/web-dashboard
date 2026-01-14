"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Notes } from "@/components/Notes/Notes";
import { User } from "@/components/User/User";
import { BackGround } from "@/components/ui/BackGround";
import { TasksProvider } from "@/context/TasksContext";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { PersonalFinance } from "@/components/PersonalFinance/PersonalFinance";
import { Pending } from "@/components/PersonalFinance/Pending";
import { PersonalFinanceProvider } from "@/context/PersonalFinanceContext";
import { Calendar } from "@/components/Calendar/Calendar";

const Task = dynamic(() => import("@/components/Task/Task"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Movements = dynamic(
  () => import("@/components/PersonalFinance/Movements"),
  { ssr: false, loading: () => <Skeleton rows={5} height={40} /> },
);

export const App: React.FC = () => {
  const columnStyle = "flex flex-col gap-4 w-full";
  const { userId, loading } = useUser();

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
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Por favor, inicia sesión</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={loginWithGoogle}
        >
          Login con Google
        </button>
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
