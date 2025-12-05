"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Masonry from "react-masonry-css";
import { Skeleton } from "@/components/Skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Search } from "@/components/Search";
import { Notes } from "@/components/Notes";
import { TopSites } from "@/components/TopSites";
import { Gpt } from "@/components/Gpt";
import { Phrases } from "@/components/Phrases";
import { Promts } from "@/components/Promts";
import { useData } from "@/hooks/useData";
import { breakpointColumnsObj, pharses, topSites } from "@/constants";
import { PerformancePanel } from "@/components/PerformancePanel";

const TasksPieChart = dynamic(() => import("@/components/TasksPieChart"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Todo = dynamic(() => import("@/components/Todo"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const NewsList = dynamic(() => import("@/components/NewsList"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Time = dynamic(() => import("@/components/Time"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

const Financial = dynamic(() => import("@/components/Financial"), {
  ssr: false,
  loading: () => <Skeleton rows={5} height={40} />,
});

export const App: React.FC = () => {
  const {
    financial,
    news,
    tasks,
    addTask,
    removeTask,
    editTask,
    toggleTaskCompletion,
    updateTasksOrder,
    clima,
    getPrompt,
    tasksLoading,
    financialLoading,
    note,
    setNote,
    getNote,
    saveNote,
  } = useData();

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Image
          src="/bg.jpg"
          alt="Fondo"
          fill
          className="object-cover fixed top-0 left-0 z-0"
          priority
        />
      </div>

      <div className="relative z-10 p-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          <ErrorBoundary>
            <Search />
          </ErrorBoundary>

          <ErrorBoundary>
            <Time clima={clima} />
          </ErrorBoundary>

          <ErrorBoundary>
            <NewsList news={news} />
          </ErrorBoundary>

          <ErrorBoundary>
            <Todo
              tasks={tasks || []}
              addTask={addTask}
              removeTask={removeTask}
              editTask={editTask}
              toggleTaskCompletion={toggleTaskCompletion}
              tasksLoading={tasksLoading}
              updateTasksOrder={updateTasksOrder}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <TasksPieChart tasks={tasks || []} />
          </ErrorBoundary>

          <ErrorBoundary>
            <Notes />
          </ErrorBoundary>

          <ErrorBoundary>
            <Financial
              financial={financial}
              financialLoading={financialLoading}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <TopSites topSites={topSites} />
          </ErrorBoundary>

          <ErrorBoundary>
            <Gpt />
          </ErrorBoundary>

          <ErrorBoundary>
            <Phrases pharses={pharses} />
          </ErrorBoundary>

          <ErrorBoundary>
            <Promts getPrompt={getPrompt} />
          </ErrorBoundary>

          <ErrorBoundary>
            <PerformancePanel
              tasks={tasks || []}
              news={Array.isArray(news) ? news : []}
              financial={financial || {}}
            />
          </ErrorBoundary>
        </Masonry>
      </div>
    </div>
  );
};

export default App;
