"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Search } from "@/components/Search/Search";
import { Notes } from "@/components/Notes/Notes";
import { Gpt } from "@/components/Gpt/Gpt";
import { Prompt } from "@/components/Prompt/Prompt";
import { User } from "@/components/User/User";
import { BackGround } from "@/components/ui/BackGround";
import { PerformanceProvider } from "@/context/PerformanceContext";
import { WebVitals } from "@/components/WebVitals/WebVitals";
import { TaskProvider } from "@/context/TasksContext";
import { PerformancePanel } from "@/components/PerformancePanel/PerformancePanel";
import { Wheater } from "@/components/Wheater/Wheater";
import { FinancialProvider } from "@/context/FinancialContext";
import { NewsProvider } from "@/context/NewsContext";
import { useEffect, useState } from "react";
import { useData } from "@/hooks/useData";

const Task = dynamic(() => import("@/components/Task/Task"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const News = dynamic(() => import("@/components/News/News"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Financial = dynamic(() => import("@/components/Financial/Financial"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

export const App: React.FC = () => {
  const columnStyle = "flex flex-col gap-4";
  const [cookieValue, setCookieValue] = useState<string | null>(null);
  const { user } = useData();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const valor = window.localStorage.getItem("authDashboard");
      setCookieValue(valor);
    }
  }, []);

  return (
    <div>
      {cookieValue === user && (
        <div className="relative w-full min-h-screen">
          <BackGround />

          <div
            className="relative z-10 p-4 grid gap-4"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {/* Column 1 */}
            <div className={columnStyle}>
              <ErrorBoundary>
                <TaskProvider>
                  <User />
                </TaskProvider>
              </ErrorBoundary>

              <ErrorBoundary>
                <NewsProvider>
                  <News />
                </NewsProvider>
              </ErrorBoundary>

              
            </div>

            {/* Column 2 */}
            <div className={columnStyle}>
              <ErrorBoundary>
                <Search />
              </ErrorBoundary>

              <ErrorBoundary>
                <FinancialProvider>
                  <Financial />
                </FinancialProvider>
              </ErrorBoundary>

              <ErrorBoundary>
                <Prompt />
              </ErrorBoundary>
            </div>

            {/* Column 3 */}
            <div className={columnStyle}>
              <ErrorBoundary>
                <Wheater />
              </ErrorBoundary>

              <ErrorBoundary>
                <Notes />
              </ErrorBoundary>

              <ErrorBoundary>
                <Gpt />
              </ErrorBoundary>
          
            </div>

            {/* Column 4 */}
            <div className={columnStyle}>
              <ErrorBoundary>
                <TaskProvider>
                  <Task />
                </TaskProvider>
              </ErrorBoundary>
            </div>
          </div>

          {/* Footer */}
          <ErrorBoundary>
            <PerformanceProvider>
              <div id="main-content">
                <WebVitals />
                <PerformancePanel />
              </div>
            </PerformanceProvider>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default App;
